{
    init: function(elevators, floors) {
    	var sortDest = function( elevator, up, down) {
    		if ( elevator.destinationQueue.length == 0) {
    			return;
    		}
    		if ( up) {
    			elevator.destinationQueue.sort( function(a, b){return a-b});
    		} else if ( down) {
    			elevator.destinationQueue.sort( function(a, b){return b-a});
    		}
    		elevator.checkDestinationQueue();
    	};
    	// alle Fahrstühle
    	for ( ei in elevators) {
	        var elevator = elevators[ ei]; // Let's use the first elevator
	        elevator.on("idle", function() {
	        	console.log( "e" + ei + " idle");
	        });
	        elevator.on("floor_button_pressed", function(floorNum) {
	        	console.log( "f" + floorNum + " pressed in e" + ei + " while at " + this.currentFloor() + " dest: " + this.destinationQueue);
	        	if ( this.goingUpIndicator() && this.destinationQueue[0] >= floorNum) {
		        	this.goToFloor( floorNum, true);
		        	console.log( "sent e" + 0 + " up to f" + floorNum + ", dest: " + this.destinationQueue);
		        	sortDest( this, this.goingUpIndicator(), this.goingDownIndicator());
		        	console.log( "sortDest e" + 0 + ", dest: " + this.destinationQueue);
    	        	return;
            	}
	        	if ( this.goingDownIndicator() && this.destinationQueue[0] <= floorNum) {
		        	this.goToFloor( floorNum, true);
		        	console.log( "sent e" + 0 + " down to f" + floorNum + ", dest: " + this.destinationQueue);
		        	sortDest( this, this.goingUpIndicator(), this.goingDownIndicator());
		        	console.log( "sortDest e" + 0 + ", dest: " + this.destinationQueue);
    	        	return;
            	}
	        	// nur eintakten, wenn nicht schon geplant 
	        	for ( dI in this.destinationQueue) {
	        		if ( this.destinationQueue[ dI] == floorNum) {
	        			return;
	        		}
	        	}
	        	console.log( "send e" + 0 + " to f" + floorNum);
	        	this.goToFloor( floorNum);
	        	sortDest( this, this.goingUpIndicator(), this.goingDownIndicator());
	        	console.log( "sortDest e" + 0 + ", dest: " + this.destinationQueue);
	        });
	        elevator.on("stopped_at_floor", function(floorNum) {
	        	console.log( "e" + ei + " stopped at f" + floorNum + ", dest: " + this.destinationQueue);
	        	if ( floorNum == 0) {
	        		this.goingDownIndicator( false);
	        		console.log( "e" + 0 + " going up: " + this.goingUpIndicator());
		        	sortDest( this, this.goingUpIndicator(), this.goingDownIndicator());
		        	console.log( "sortDest e" + 0 + ", dest: " + this.destinationQueue);
	        	}
	        	if ( floorNum == ( floors.length-1)) {
	        		this.goingUpIndicator( false);
	        		console.log( "e" + 0 + " going down: " + this.goingDownIndicator());
		        	sortDest( this, this.goingUpIndicator(), this.goingDownIndicator());
		        	console.log( "sortDest e" + 0 + ", dest: " + this.destinationQueue);
	        	}
	        });
	        elevator.on("passing_floor", function(floorNum, direction) {
	        	console.log( "e" + ei + " passing f" + floorNum + " dir: " + direction + ", dest: " + this.destinationQueue);
	        });
    	}
    	// alle Etagen
        for ( fI in floors) {
            var floor = floors[ fI];
            floor.on("up_button_pressed", function() {
	        	console.log( "f" + this.floorNum() + " pressed up");
                // Maybe tell an elevator to go to this floor?
            	for ( ei in elevators) {
        	        var elevator = elevators[ ei]; // Let's use the first elevator
        	        if ( elevator.currentFloor() < this.floorNum() && elevator.goingUpIndicator()) {
        	        	elevator.goToFloor( this.floorNum());
        	        	console.log( "send running e" + ei + " up to f" + this.floorNum());
    		        	sortDest( elevator, elevator.goingUpIndicator(), elevator.goingDownIndicator());
    		        	console.log( "sortDest e" + ei + ", dest: " + elevator.destinationQueue);
            			return;
        	        }
            	}
	        	// nur eintakten, wenn nicht schon geplant 
	        	for ( dI in elevators[ 0].destinationQueue) {
	        		if ( elevators[ 0].destinationQueue[ dI] == this.floorNum()) {
	        			return;
	        		}
	        	}
	        	console.log( "up from " + this.floorNum() + ": send later e" + 0 + " to f" + this.floorNum());
	        	var elevator = elevators[ 0];
                elevator.goToFloor( this.floorNum());
	        	sortDest( elevator, elevator.goingUpIndicator(), elevator.goingDownIndicator());
	        	console.log( "sortDest e" + ei + ", dest: " + elevator.destinationQueue);
            });
            floor.on("down_button_pressed", function() {
	        	console.log( "f" + this.floorNum() + " pressed down");
                // Maybe tell an elevator to go to this floor?
            	var foundElevator = false;
            	for ( ei in elevators) {
        	        var elevator = elevators[ ei]; // Let's use the first elevator
        	        if ( elevator.currentFloor() > this.floorNum() && elevator.goingDownIndicator()) {
        	        	elevator.goToFloor( this.floorNum());
        	        	console.log( "send running e" + ei + " down to f" + this.floorNum());
        	        	foundElevator = true;
        	        	return;
        	        }
            	}
	        	// nur eintakten, wenn nicht schon geplant 
	        	for ( dI in elevators[ 0].destinationQueue) {
	        		if ( elevators[ 0].destinationQueue[ dI] == this.floorNum()) {
	        			return;
	        		}
	        	}
	        	console.log( "down from " + this.floorNum() + ": send later e" + 0 + " to f" + this.floorNum());
                elevators[ 0].goToFloor( this.floorNum());
            });
        }
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}

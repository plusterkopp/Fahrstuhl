/**
 * 
 */

{
    init: function(elevators, floors) {
    	// alle Fahrstühle
    	for ( ei in elevators) {
	        var elevator = elevators[ ei]; // Let's use the first elevator
	        elevator.on("idle", function() {
	        	console.log( "e" + ei + " idle");
	        });
	        elevator.on("floor_button_pressed", function(floorNum) {
	        	console.log( "f" + floorNum + " pressed in e" + ei + " while at " + elevator.currentFloor() + " dest: " + elevator.destinationQueue);
	        	if ( elevator.goingUpIndicator() && elevator.destinationQueue[0] >= floorNum) {
		        	console.log( "send e" + 0 + " up to f" + floorNum);
    	        	elevator.goToFloor( floorNum, true);
    	        	return;
            	}
	        	if ( elevator.goingDownIndicator() && elevator.destinationQueue[0] <= floorNum) {
		        	console.log( "send e" + 0 + " down to f" + floorNum);
    	        	elevator.goToFloor( floorNum, true);
    	        	return;
            	}
	        	console.log( "send e" + 0 + " to f" + floorNum);
            	elevator.goToFloor( floorNum);
	        });
	        elevator.on("stopped_at_floor", function(floorNum) {
	        	console.log( "e" + ei + " stopped at f" + floorNum + ", dest: " + elevator.destinationQueue);
	        });
	        elevator.on("passing_floor", function(floorNum, direction) {
	        	console.log( "e" + ei + " passing f" + floorNum + " dir: " + direction + ", dest: " + elevator.destinationQueue);
	        });
    	}
    	// alle Etagen
        for ( fI in floors) {
            var floor = floors[ fI];
            floor.on("up_button_pressed", function() {
	        	console.log( "f" + floor.floorNum() + " pressed up");
                // Maybe tell an elevator to go to this floor?
            	var foundElevator = false;
            	for ( ei in elevators) {
        	        var elevator = elevators[ ei]; // Let's use the first elevator
        	        if ( elevator.currentFloor() < floor.floorNum() && elevator.goingUpIndicator()) {
        	        	elevator.goToFloor( floor.floorNum());
        	        	console.log( "send running e" + ei + " up to f" + floor.floorNum());
        	        	foundElevator = true;
            			return;
        	        }
            	}
	        	console.log( "up from " + floor.floorNum() + ": send later e" + 0 + " to f" + floor.floorNum());
                elevators[ 0].goToFloor( floor.floorNum());
            });
            floor.on("down_button_pressed", function() {
	        	console.log( "f" + floor.floorNum() + " pressed down");
                // Maybe tell an elevator to go to this floor?
            	var foundElevator = false;
            	for ( ei in elevators) {
        	        var elevator = elevators[ ei]; // Let's use the first elevator
        	        if ( elevator.currentFloor() > floor.floorNum() && elevator.goingDownIndicator()) {
        	        	elevator.goToFloor( floor.floorNum());
        	        	console.log( "send running e" + ei + " down to f" + floor.floorNum());
        	        	foundElevator = true;
        	        	return;
        	        }
            	}
	        	console.log( "down from " + floor.floorNum() + ": send later e" + 0 + " to f" + floor.floorNum());
                elevators[ 0].goToFloor( floor.floorNum());
            });
        }
    },
    update: function(dt, elevators, floors) {
        // We normally don't need to do anything here
    }
}

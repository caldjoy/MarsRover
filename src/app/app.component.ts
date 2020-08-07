import { Component } from "@angular/core";
import { FormBuilder, FormGroup, FormArray } from "@angular/forms";

import { GraphPosition } from "./Models/graph-position";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  title = "mars-rover";

  explorationBounds = { X: 0, Y: 0 };
  finalPositions: GraphPosition[];
  instructionList: string;

  formGroup: FormGroup;
  instructionsArray: FormArray;

  constructor(private fb: FormBuilder) {
    this.instructionsArray = fb.array([this.createInstructionsForm()]);
    this.formGroup = fb.group({ instructionsArray: this.instructionsArray });
  }

  setExplorationBounds(data) {
    console.log(data);
  }

  setBounds(val, id) {
    if (id == "X") {
      this.explorationBounds.X = val;
    }
    if (id == "Y") {
      this.explorationBounds.Y = val;
    }
  }

  createInstructionsForm() {
    return this.fb.group({ position: "", instructions: "" });
  }

  addInstructionsForm() {
    this.instructionsArray.push(this.createInstructionsForm());
  }

  submitForm(fg) {
    this.finalPositions = null;
    let array = fg.value.instructionsArray;
    for (let i = 0; i < array.length; i++) {

      //check for white space in position array using regex
      if (/\s/.test(array[i].position)) {
        alert("Position contains white spaces");
        break;
      }

      //check length of position to verify one digit has been entered for each coordinate
      let positionArray = [...array[i].position];
      if (positionArray.length != 3) {
        alert("Invalid input");
        break;
      }
      
      let roverPosition = new GraphPosition();
      roverPosition.X = Number(positionArray[0]);
      roverPosition.Y = Number(positionArray[1]);
      roverPosition.Z = positionArray[2];
      let finalPosition = this.executeInstructions(
        roverPosition,
        array[i].instructions
      );
      if (this.finalPositions) {
        this.finalPositions.push(finalPosition);
      } else {
        this.finalPositions = [finalPosition];
      }
    }
  }

  executeInstructions(position: GraphPosition, instructions: string) {
    var updatedPosition = Object.assign(new GraphPosition(), position);
    let instructionsList = [...instructions.toUpperCase()];

    for (let i in instructionsList) {
      let char = instructionsList[i];
      if (char == " ") {
        continue;
      } else if (char == "L") {
        //turn left
        switch (updatedPosition.Z) {
          case "N":
            updatedPosition.Z = "W";
            break;
          case "E":
            updatedPosition.Z = "N";
            break;
          case "S":
            updatedPosition.Z = "E";
            break;
          case "W":
            updatedPosition.Z = "S";
            break;
        }
      } else if (char == "R") {
        //turn right
        switch (updatedPosition.Z) {
          case "N":
            updatedPosition.Z = "E";
            break;
          case "E":
            updatedPosition.Z = "S";
            break;
          case "S":
            updatedPosition.Z = "W";
            break;
          case "W":
            updatedPosition.Z = "N";
            break;
        }
      } else if (char == "M") {
        //move forward one
        switch (updatedPosition.Z) {
          case "N":
            updatedPosition.Y += 1;
            break;
          case "E":
            updatedPosition.X += 1;
            break;
          case "S":
            updatedPosition.Y -= 1;
            break;
          case "W":
            updatedPosition.X -= 1;
            break;
        }
      } else {
        alert(
          "Invalid character in instructions string, skipping character and continuing with execution."
        );
        continue;
      }
      if (
        updatedPosition.X > this.explorationBounds.X ||
        updatedPosition.Y > this.explorationBounds.Y ||
        updatedPosition.X < 0 ||
        updatedPosition.Y < 0
      ) {
        alert(
          "Rover instructions out of bounds, current position: X " +
            updatedPosition.X +
            ", Y " +
            updatedPosition.Y +
            ", Z " +
            updatedPosition.Z
        );
        break;
      }
    }
    return updatedPosition;
  }
}

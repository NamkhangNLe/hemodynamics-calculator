import React, { useState, useEffect } from "react";
import { useParams } from "react-router";
import {useNavigate} from 'react-router-dom';

export default function View() {

    const params = useParams();
    const navigate = useNavigate();
    const [patientCalculations, setPatientCalculations] = useState([]);

    /** EditingID keeps track of which Calculation we are currently editing */
    const [editingID, setEditingID] = useState(null);

    /** The following hooks track the updates to each field (Date, ValueType/Formula, and Calculated Value) */
    const [editedDate, setEditedDate] = useState("");
    const [editedValueType, setEditedValueType] = useState("");
    const [editedCalculatedValue, setEditedCalculatedValue] = useState("");

    useEffect(() => {

      /**
       * Fetches all the calculations from the DB, then
       * filters them by patient ID.
       */
      async function fetchPatientCalculation() {
        const id = params.id.toString();
        const response = await fetch('http://localhost:5000/calculation/');

        if (!response.ok) {
            const message = `An error has occurred: ${response.statusText}`;
            window.alert(message);
            return;
        }

        // Parse server response as JSON. Server grabs all calculations in the DB
        const calculations = await response.json();

        if (!calculations) {
            window.alert(`Record with id ${id} not found`);
            navigate("/");
            return;
        }

        //Filter the calculations by patient id.
        const patientCalculations = calculations.filter(calculation => calculation.patient_id === id);
        setPatientCalculations(patientCalculations);

      }

      fetchPatientCalculation();
      return;
    }, [params.id, navigate]);

    /**
     * Handles the edit button being pushed by setting the hooks to whatever is entered. Default is whatever is currently in there
     * @param {String} calculationId The ID of the calculation that we are currently editing
     */
    const handleEdit = (calculationId) => {

      const calculationToEdit = patientCalculations.find(calculation => calculation._id === calculationId);

      // Default the EditingID to whatever the current value of the calculation is.
      if (calculationToEdit) {
        setEditingID(calculationId);
        setEditedDate(calculationToEdit.date);
        setEditedValueType(calculationToEdit.valueType);
        setEditedCalculatedValue(calculationToEdit.calculatedValue);
      }

    };

    /**
     * Saves the data/values currently in the text fields to the database.
     */
    async function handleSave(e) {
      e.preventDefault();

      const editedCalculation = {
        date: editedDate,
        valueType: editedValueType,
        calculatedValue: editedCalculatedValue
      };

      await fetch(`http://localhost:5000/updatecalc/${editingID}`, {
        method: "POST",
        body: JSON.stringify(editedCalculation),
        headers: {
          'Content-Type': 'application/json'
        },
      });

      // Clear te EditingID, EditedDate, EditedValueType, and EditedCalculatedValue once saved.
      setEditingID(null);
      setEditedDate("");
      setEditedValueType("");
      setEditedCalculatedValue("");

    };

    // For front-end team: patientCalculations is a JSON. You can parse it however you want to display it.
    return (
    <div>
        <h3>View Patient</h3>
        <div>
          <h4>Calculation History</h4>

          <ul>
          {patientCalculations.map(calculation => (
            <li key={calculation._id}>

              {editingID === calculation._id ? (
                <>
                  Date: <input type="text" value={editedDate} onChange={(e) => setEditedDate(e.target.value)} />

                  Formula: <input type="text" value={editedValueType} onChange={(e) => setEditedValueType(e.target.value)} />

                  Calculated Value: <input type="text" value={editedCalculatedValue} onChange={(e) => setEditedCalculatedValue(e.target.value)} />

                  <button onClick={handleSave}>Save</button>
                </>
              ) : (
                <>
                  Date: {calculation.date}, Formula: {calculation.valueType}, Calculated Value: {calculation.calculatedValue}
                  <button onClick={() => handleEdit(calculation._id)}>Edit</button>
                </>
              )}

            </li>
          ))}
        </ul>

        </div>
    </div>
    );
  }

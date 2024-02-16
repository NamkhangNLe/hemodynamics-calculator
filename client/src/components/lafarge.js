import React, { useState, useEffect } from "react";
import { onSubmit } from "../utils/calculationUtils";
import "../styles/styles.css";

export default function LaFarge({ selectedPatientID }) {
    const [logeage, setLogeage] = useState("");
    const [hr, setHr] = useState("");
    const [form, setForm] = useState({
        valueType: "VO2 by LaFarge Equation",
        calculatedValue: ""
    });
    const [placeholderText, setPlaceholderText] = useState("");

    useEffect(() => {
        setPlaceholderText((logeage === "" && hr === "") ? "Enter calculation inputs" : "Missing inputs");
        setForm({ valueType: "VO2 by LaFarge Equation", calculatedValue: (logeage !== "" && hr !== "") ? (138.1 - (11.49 * +logeage) + (0.378 * +hr)).toFixed(3) : "" });
    }, [logeage, hr]);

    return (
        <div>
            <h1>VO2 by LaFarge Equation</h1>
            <form onSubmit={e => onSubmit(e, selectedPatientID, form)}>
                <div>
                    Logeage: <input name="logeage" placeholder="Ex: ?" type="number" value={logeage} onChange={e => setLogeage(e.target.value)} />
                </div>
                <div>
                    Heart Rate: <input name="hr" placeholder="Ex: ?" type="number" value={hr} onChange={e => setHr(e.target.value)} />
                </div>
                <div>
                    Output: <input type="text" placeholder={placeholderText} value={form.calculatedValue} readOnly />
                </div>
                <div>
                    <button type="submit">Save</button>
                </div>
            </form>
        </div>
    );
}
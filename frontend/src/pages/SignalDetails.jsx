import React, { useEffect } from "react";

alert("🔥 الملف SignalDetails.jsx يعمل فعليًا على Vercel!");

const SignalDetails = () => {
  useEffect(() => {
    console.log("🔥 SignalDetails.jsx يعمل وتم تحميله من Vercel ✅");
  }, []);

  return (
    <div style={{
      padding: "30px",
      margin: "30px",
      border: "4px dashed red",
      textAlign: "center",
      fontSize: "24px",
      fontWeight: "bold",
      color: "darkred",
      backgroundColor: "#ffeeee"
    }}>
      ✅ هذا هو الملف <strong>SignalDetails.jsx</strong> الفعلي وتم تحميله من Vercel بنجاح
    </div>
  );
};

export default SignalDetails;

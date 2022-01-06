import React from "react";

function Spinner(props) {
  return (
    <>
      <div className="text-center">
        <div
          className="spinner-border"
          role="status"
          style={{
            width: 5 + "rem",
            height: 5 + "rem",
            visibility: props.visib,
          }}
        >
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    </>
  );
}

export default Spinner;

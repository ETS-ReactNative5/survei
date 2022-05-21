import React from "react";

const ProgressBar = (props) => {
  const { bgcolor, completed } = props;

  const containerStyles = {
    height: 20,
    width: "100%",
    background: "rgb(208 213 215)",
    borderRadius: 50,
    border:'none',
    boxShadow: 'rgb(221 227 229) -1px 2px 13px 3px'
  };

 


  const fillerStyles = {
    height: "100%",
    width: `${completed}%`,
    background: bgcolor,
    transition: "width 1s ease-in-out",
    borderRadius: "inherit",
    textAlign: "right",
    transition: "width 0.5s ease-in-out"
  };

  const labelStyles = {
    padding: "5px",
    color: "white",
    marginRight: "15px",
    marginBottom: "5px"
  };

  return (
    <div style={containerStyles}>
      <div style={fillerStyles}>
        <span style={labelStyles}>{`${completed}% ` } {completed > 99?'completed!':'progress'}</span>
      </div>
    </div>
  );
};

export default ProgressBar;

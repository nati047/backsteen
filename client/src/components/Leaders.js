<<    import React from "react";

function Leaders () {
  return (
    <html>
    <head>
        <style>
            #input-form {
                padding: 15px;
                background-color: #CCCCCC;
            }
            #input-form input {
                padding: 10px;
                font-size: 20px;
                width: 400px;
            }
        </style>
    </head>
    <body>
        <div id="input-form">
            <input type="text" name="username" placeholder="Enter a Name" />
        </div>
    </body>
</html>
  )
};

export default Leaders;

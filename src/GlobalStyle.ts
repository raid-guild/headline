import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    html {
        height: 100%;
			  /* 1rem = 10px */
        font-size: 62.5%;
    }
    body {
       height: 100%;
       margin: 0px;
       padding: 0px;
       background-color: rgb(252, 253, 254);
			 font-family: "Inter";
       font-size: 1.6rem;
			 color: #000000;
    }

		a {
		  text-decoration: none;
		}

		#root {
		  height: 100%;
		}
`;

export default GlobalStyle;

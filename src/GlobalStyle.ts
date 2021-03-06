import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
    html {
        height: 100%;
			  /* 1rem = 10px */
        font-size: 62.5%;
		display: block;
		
    }

	*, *::before, *::after {
		box-sizing: border-box;
		border-width: 0;
		border-style: solid;
		box-sizing: border-box;
	}
		
    body {
       /* height: 100%; */
       min-height: 100%;
  	   height: 100%;
       margin: 0px;
       padding: 0px;
	   box-sizing: border-box;
       background-color: rgb(252, 253, 254);
	   font-family: "Inter";
       font-size: 1.6rem;
			 color: #000000;
    }

		a {
		  text-decoration: none;
		}

		#root {
		  /* height: 100%; */
		}

		// remirror
		.remirror-theme {
		  width: 100%;
			max-width: 100rem;

		}

		.remirror-editor-wrapper {
		  height: 100%;
		}

		.remirror-editor {
		  height: 100%;
		}
`;

export default GlobalStyle;

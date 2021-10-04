import * as dotenv from 'dotenv';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import App from './App';

dotenv.config();

ReactDOM.render(
    <App />,
    document.getElementById('root'),
);

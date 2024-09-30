/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './src/navigations/route/App';
import {name as appName} from './app.json';
AppRegistry.registerComponent(appName, () => ()=><App/>);

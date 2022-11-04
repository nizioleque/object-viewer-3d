import { createContext } from 'react';

interface AppContext {}

const appContextDefaultValue: AppContext = {};

export const AppContext = createContext<AppContext>(appContextDefaultValue);

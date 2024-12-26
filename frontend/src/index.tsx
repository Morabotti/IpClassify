import { createRoot } from 'react-dom/client';

import Application from '@components/Application';

import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';

const root = createRoot(document.getElementById('mount') as HTMLDivElement);

root.render(<Application />);

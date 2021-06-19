import './App.css';
import MediaEditor from './components/MediaEditor';
import RichMediaEditor from './components/RichMediaEditor';

function App() {
	return (
		<div className='App'>
			<MediaEditor />
			<br />
			<br />

			<RichMediaEditor />
		</div>
	);
}

export default App;

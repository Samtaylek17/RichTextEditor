import './App.css';
import MediaEditor from './components/MediaEditor';
import MediaUploadEditor from './components/MediaUploadEditor';
import RichMediaEditor from './components/RichMediaEditor';

function App() {
	return (
		<div className='App'>
			{/* <MediaEditor /> */}
			<br />
			<br />

			<RichMediaEditor />
			<br></br>
			<MediaUploadEditor />
		</div>
	);
}

export default App;

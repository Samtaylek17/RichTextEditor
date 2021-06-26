import './App.css';
import MediaComplete from './components/MediaComplete';
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
			{/* <MediaUploadEditor /> */}
			<MediaComplete />
		</div>
	);
}

export default App;

import React, { useState, useRef } from 'react';
import { Editor, EditorState, convertToRaw, AtomicBlockUtils, RichUtils } from 'draft-js';
import '../../node_modules/draft-js/dist/Draft.css';
import { Upload, Button, Modal } from 'antd';

const RichMediaEditor = () => {
	const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
	const [showURLInput, setShowURLInput] = useState(false);
	const [url, setUrl] = useState('');
	const [urlType, setUrlType] = useState('');
	const [urlValue, setUrlValue] = useState('');

	const inputRef = useRef({});

	console.log(inputRef.current['editor']);
	const focus = () => {
		inputRef.current['editor'].focus();
	};

	const logState = () => {
		const content = editorState.getCurrentContent();
		console.log(convertToRaw(content));
	};

	const onChange = (editorState) => setEditorState(editorState);

	const onURLChange = (e) => setUrlValue(e.target.value);

	const handleKeyCommand = (command, editorState) => {
		const newState = RichUtils.handleKeyCommand(editorState, command);
		if (newState) {
			onChange(newState);

			return true;
		}
		return false;
	};

	const confirmMedia = (e) => {
		e.preventDefault();
		const contentState = editorState.getCurrentContent();
		const contentStateWithEntity = contentState.createEntity(urlType, 'IMMUTABLE', { src: urlValue });
		const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
		const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });

		// The third parameter here is a space string, not an empty string
		// If you set an empty string, you will get an error: Unknown DraftEntity key: null
		setEditorState(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '));
		setShowURLInput(false);
		setUrlValue('');

		(() => {
			setTimeout(() => focus(), 0);
		})();
	};

	const onURLInputKeyDown = (e) => {
		if (e.which === 13) {
			confirmMedia(e);
		}
	};

	const promptForMedia = (type) => {
		setShowURLInput(true);
		setUrlValue('');
		setUrlType(type);

		setTimeout(() => inputRef.current['url'].focus(), 0);
	};

	const addAudio = () => {
		promptForMedia('audio');
	};

	const addImage = () => {
		promptForMedia('image');
	};

	const addVideo = () => {
		promptForMedia('video');
	};

	let urlInput;
	if (showURLInput) {
		urlInput = (
			<div style={styles.urlInputContainer}>
				<input
					onChange={onURLChange}
					ref={(el) => (inputRef.current['url'] = el)}
					style={styles.urlInput}
					type='text'
					value={urlValue}
					onKeyDown={onURLInputKeyDown}
				/>
				<button onMouseDown={confirmMedia}>Confirm</button>
			</div>
		);
	}

	return (
		<div style={styles.root}>
			<div style={{ marginBottom: 10 }}>Use the buttons to add audio, image, or video.</div>
			<div style={{ marginBottom: 10 }}>
				Here are some local examples that can be entered as a URL:
				<ul>
					<li>media.mp3</li>
					<li>media.png</li>
					<li>media.mp4</li>
				</ul>
			</div>
			<div style={styles.buttons}>
				<button onMouseDown={addAudio} style={{ marginRight: 10 }}>
					Add Audio
				</button>
				<Upload>
					<Button onMouseDown={addImage} style={{ marginRight: 10 }}>
						Add Image
					</Button>
				</Upload>
				<button onMouseDown={addVideo} style={{ marginRight: 10 }}>
					Add Video
				</button>
			</div>
			{urlInput}
			<div style={styles.editor}>
				<Editor
					blockRendererFn={mediaBlockRenderer}
					editorState={editorState}
					handleKeyCommand={handleKeyCommand}
					onChange={onChange}
					placeholder='Enter some text...'
					ref={(el) => (inputRef.current['editor'] = el)}
				/>
			</div>
			<input onClick={logState} style={styles.button} type='button' value='Log State' />
		</div>
	);
};

const mediaBlockRenderer = (block) => {
	if (block.getType() === 'atomic') {
		return {
			component: Media,
			editable: false,
		};
	}
	return null;
};

const Audio = (props) => {
	return <audio controls src={props.src} style={styles.media} />;
};

const Image = (props) => {
	return <img src={props.src} style={styles.media} />;
};

const Video = (props) => {
	return <video controls src={props.src} style={styles.media} />;
};

const Media = (props) => {
	const entity = props.contentState.getEntity(props.block.getEntityAt(0));
	const { src } = entity.getData();
	const type = entity.getType();

	let media;
	if (type === 'audio') {
		media = <Audio src={src} />;
	} else if (type === 'image') {
		media = <Image src={src} />;
	} else if (type === 'video') {
		media = <Video src={src} />;
	}

	return media;
};

const styles = {
	root: {
		fontFamily: "'Georgia', serif",
		padding: 20,
		width: 600,
	},
	buttons: {
		marginBottom: 10,
	},
	urlInputContainer: {
		marginBottom: 10,
	},
	urlInput: {
		fontFamily: "'Georgia', serif",
		marginRight: 10,
		padding: 3,
	},
	editor: {
		border: '1px solid #ccc',
		cursor: 'text',
		minHeight: 80,
		padding: 10,
	},
	button: {
		marginTop: 10,
		textAlign: 'center',
	},
	media: {
		width: '100%',
		// Fix an issue with Firefox rendering video controls
		// with 'pre-wrap' white-space
		whiteSpace: 'initial',
	},
};

export default RichMediaEditor;

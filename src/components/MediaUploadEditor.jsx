import React, { useState, useRef } from 'react';
import { Editor, EditorState, convertToRaw, AtomicBlockUtils, RichUtils } from 'draft-js';
import '../../node_modules/draft-js/dist/Draft.css';
import { Upload, Button, Modal, Input, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const MediaUploadEditor = () => {
	const [visible, setVisible] = useState(false);
	const [confirmLoading, setConfirmLoading] = useState(false);

	const [fileList, setFileList] = useState([]);
	const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
	const [urlType, setUrlType] = useState('');
	const [urlValue, setUrlValue] = useState('');
	const [uploading, setUploading] = useState(false);

	const imageRef = useRef({});

	const focus = () => {
		imageRef.current['editor'].focus();
	};

	const onChange = (editorState) => setEditorState(editorState);

	const getBase64 = (file) => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result);
			reader.onerror = (error) => reject(error);
		});
	};

	const confirmMedia = (e) => {
		e.preventDefault();

		const contentState = editorState.getCurrentContent();
		const contentStateWithEntity = contentState.createEntity(urlType, 'IMMUTABLE', { src: fileList[0].preview });
		const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
		const newEditorState = EditorState.set(editorState, { currentContent: contentStateWithEntity });

		// The third parameter here is a space string, not an empty string
		// If you set an empty string, you will get an error: Unknown DraftEntity key: null
		setEditorState(AtomicBlockUtils.insertAtomicBlock(newEditorState, entityKey, ' '));
		// setShowURLInput(false);
		setFileList([]);

		(() => {
			setTimeout(() => focus(), 0);
		})();

		setConfirmLoading(true);
		setTimeout(() => {
			setVisible(false);
			setConfirmLoading(false);
		}, 0);
	};

	const showModal = () => {
		setVisible(true);
	};

	const handleCancel = () => {
		setVisible(false);
	};

	const props = {
		showUploadList: false,
		accept: '.jpg,.jpeg,.png',

		beforeUpload: async (file) => {
			if (!file[0].url && !file[0].preview) {
				file[0].preview = await getBase64(file[0].originFileObj);
			}
			setFileList(file[0].preview);

			return false;
		},
		fileList,
	};

	const handleChange = async ({ fileList }) => {
		setFileList(fileList);

		if (!fileList[0].url && !fileList[0].preview) {
			fileList[0].preview = await getBase64(fileList[0].originFileObj);
		}

		setUrlType('image');
		setUrlValue(fileList[0].preview);
	};

	const promptForMedia = (type) => {
		setUrlType(type);
	};

	const addImage = () => {
		promptForMedia('image');
	};

	const addVideo = () => {
		promptForMedia('video');
	};

	const handleKeyCommand = (command, editorState) => {
		const newState = RichUtils.handleKeyCommand(editorState, command);
		if (newState) {
			onChange(newState);

			return true;
		}
		return false;
	};

	return (
		<>
			<div style={styles.buttons}>
				<Modal
					title='Upload Image'
					visible={visible}
					onOk={confirmMedia}
					ref={(el) => (imageRef.current['button'] = el)}
					confirmLoading={confirmLoading}
					onCancel={handleCancel}>
					<p>Upload the image below</p>
					<Upload {...props} onChange={handleChange}>
						<Button icon={<UploadOutlined />} onMouseDown={addImage}>
							Select File
						</Button>
					</Upload>
					<Button
						type='primary'
						onClick={confirmMedia}
						ref={(el) => (imageRef.current['button'] = el)}
						disabled={fileList.length === 0}
						loading={uploading}
						style={{ marginTop: 16 }}>
						{uploading ? 'Uploading' : 'Start Upload'}
					</Button>
				</Modal>
				<Button onClick={showModal} style={{ marginRight: 10 }}>
					Add Image
				</Button>
			</div>
			<div style={styles.editor}>
				<Editor
					blockRendererFn={mediaBlockRenderer}
					editorState={editorState}
					handleKeyCommand={handleKeyCommand}
					onChange={onChange}
					placeholder='Enter some text...'
					ref={(el) => (imageRef.current['editor'] = el)}
				/>
			</div>
		</>
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
	if (type === 'image') {
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
		width: '5%',
		// Fix an issue with Firefox rendering video controls
		// with 'pre-wrap' white-space
		whiteSpace: 'initial',
	},
};

export default MediaUploadEditor;

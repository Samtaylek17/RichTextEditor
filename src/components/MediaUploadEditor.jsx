import React, { useState, useRef } from 'react';
import { Editor, EditorState, convertToRaw, AtomicBlockUtils, RichUtils } from 'draft-js';
import '../../node_modules/draft-js/dist/Draft.css';
import { Upload, Button, Modal, Input } from 'antd';


const MediaUploadEditor = () => {
  const [visible, setVisible] = useState(false);
  const [confirmLoading, setConfirmLoading]
}
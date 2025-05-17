/* eslint-disable no-debugger */
// main.jsx
import React, { useState, useRef } from 'react';
import { Button, Modal, Row, Col, Card, Space } from 'antd';
import { PlusOutlined } from '@ant-design/icons';


export default function Main() {
  const [images, setImages] = useState([]); // { uid, name, url }[]
  const [preview, setPreview] = useState({ open: false, url: '', title: '' });
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    debugger
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    Modal.confirm({
      title: 'Upload Images',
      content: 'Replace existing images, or add to the current gallery?',
      okText: 'Replace',
      cancelText: 'Add',
      onOk() {
        processFiles(files, true);
      },
      onCancel() {
        processFiles(files, false);
      },
    });
    e.target.value = null; // reset so same files can be re‑selected later
  };

  const processFiles = (files, clearAll) => {
    const newImages = [];
    files.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        //debugger
        newImages.push({
          uid: `${file.name}-${Date.now()}-${idx}`,
          name: file.name,
          url: event.target.result,
        });
        // once all files have been read
        if (newImages.length === files.length) {
          setImages(clearAll ? newImages : [...images, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const showPreview = (img) => {
    setPreview({ open: true, url: img.url, title: img.name });
  };

  const closePreview = () => {
    setPreview({ ...preview, open: false });
  };

  return (
    <div style={{ padding: 24 }}>
      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleUploadClick}
        >
          Upload Images
        </Button>
      </Space>

      <input
        type="file"
        accept="image/*"
        multiple
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <Row gutter={[16, 16]}>
        {images.map((img) => (
          <Col key={img.uid} xs={24} sm={12} md={12} lg={6}>
            <Card
              hoverable
              style={{
                borderRadius: 12,
                boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                overflow: 'hidden',
              }}
              cover={
                <img
                  alt={img.name}
                  src={img.url}
                  style={{ width: '100%', height: 'auto' }}
                />
              }
              onClick={() => showPreview(img)}
            >
              <Card.Meta title={img.name} />
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        open={preview.open}
        title={preview.title}
        footer={null}
        onCancel={closePreview}
      >
        <img
          alt={preview.title}
          style={{ width: '100%' }}
          src={preview.url}
        />
        hello
      </Modal>
    </div>
  );
}

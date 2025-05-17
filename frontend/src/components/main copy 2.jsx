/* eslint-disable no-debugger */
// main.jsx
// main.jsx
import React, { useState, useRef } from 'react';
import { Button, Modal, Row, Col, Card, Space, Typography } from 'antd';
import { PlusOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
const { Text } = Typography;

export default function Main() {
  const [images, setImages] = useState([]); // { uid, name, url }[]
  const [preview, setPreview] = useState({ open: false, currentIndex: 0 });
  const fileInputRef = useRef(null);

  const handleUploadClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;

    if (images.length) {

        Modal.confirm({
        title: 'Seleccionar imágenes',
        content: 'Reemplazar imágenes existentes o añadir a la galería actual?',
        okText: 'Reemplazar',
        cancelText: 'Añadir',
        onOk() {
            processFiles(files, true);
        },
        onCancel() {
            processFiles(files, false);
        },
        });

        // Reset so the same files can be re‑selected later
        e.target.value = null;

    } else {
        processFiles(files, true);
    }
  };

  const processFiles = (files, clearAll) => {
    const newImages = [];
    files.forEach((file, idx) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        newImages.push({
          uid: `${file.name}-${Date.now()}-${idx}`,
          name: file.name,
          url: event.target.result,
        });
        if (newImages.length === files.length) {
          setImages(clearAll ? newImages : [...images, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const showPreview = (index) => {
    setPreview({ open: true, currentIndex: index });
  };

  const closePreview = () => {
    setPreview((prev) => ({ ...prev, open: false }));
  };

  const prevImage = () => {
    setPreview((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex - 1,
    }));
  };

  const nextImage = () => {
    setPreview((prev) => ({
      ...prev,
      currentIndex: prev.currentIndex + 1,
    }));
  };

  // current image object (or empty if none)
  const currentImg = images[preview.currentIndex] || {};

  return (

   


    <div style={{ padding: 24 }}>    

    <div style={{ padding: 24 }}>
            <Text strong style={{ fontSize: 24, marginBottom: 16 }}>
            Detección y Conteo de Animales en Manadas Densas
            </Text>
        </div>

      <Space style={{ marginBottom: 16 }}>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleUploadClick}
        >
          Seleccionar imágenes
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
        {images.map((img, idx) => (
          <Col key={img.uid} xs={24} sm={12} md={12} lg={6}>
            <Card
              hoverable
              cover={
                <img
                  alt={img.name}
                  src={img.url}
                  style={{ width: '100%', height: 'auto' }}
                />
              }
              onClick={() => showPreview(idx)}
            >
              <Card.Meta title={img.name} />
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        open={preview.open}
        title={currentImg.name}
        footer={[
          <Button
            key="prev"
            icon={<LeftOutlined />}
            onClick={prevImage}
            disabled={preview.currentIndex === 0}
          />,
          <Button
            key="next"
            icon={<RightOutlined />}
            onClick={nextImage}
            disabled={preview.currentIndex === images.length - 1}
          />,
        ]}
        onCancel={closePreview}
      >
        <img
          alt={currentImg.name}
          style={{ width: '100%' }}
          src={currentImg.url}
        />
      </Modal>
    </div>
  );
}

import React from 'react';
import { Modal } from 'antd';

interface ConfirmationModalProps {
  visible: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  visible,
  onConfirm,
  onCancel,
}) => {
  return (
    <Modal
      title="Подтверждение"
      visible={visible}
      onOk={onConfirm}
      onCancel={onCancel}
      okText="Да"
      cancelText="Отмена"
    >
      <p>Вы уверены, что хотите выполнить это действие?</p>
    </Modal>
  );
};

export default ConfirmationModal;
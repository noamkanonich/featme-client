import { Text } from 'react-native';
import React from 'react';
import Modal from '../../components/modal/Modal';

interface IUpdateFoodModal {
  visible: boolean;
  onUpdate: () => void;
  onRequestClose: () => void;
}

const UpdateFoodModal = ({ visible, onRequestClose }: IUpdateFoodModal) => {
  return (
    <Modal visible={visible} onRequestClose={onRequestClose}>
      <Text>UpdateFoodModal</Text>
    </Modal>
  );
};

export default UpdateFoodModal;

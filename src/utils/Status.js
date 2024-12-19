// StatusEntity.js
import axios from 'axios';
import { NotificationManager } from 'react-notifications';

export const StatusEntity = async (entityType, id, currentStatus, setData, data) => {
    const BASE_URL = `http://localhost:5000`;
    // console.log(entityType)
    // console.log(id)
    // console.log(setData)
    // console.log(data)
    try {
        const newStatus = currentStatus === 1 ? 0 : 1;
        let url = '';

        switch (entityType) {

            case 'Category':
                url = `${BASE_URL}/api/status/${id}`;
                break;


            case 'Cuppon':
                url = `${BASE_URL}/api/handlecategorystatus/${id}`;
                break;

            case 'Property':
                url = `${BASE_URL}/api/status/${id}`;
                break;

            case 'ExtraImage':
                url = `${BASE_URL}/api/status/${id}`;
                break;

            case 'Facility':
                url = `${BASE_URL}/api/status/${id}`;
                break;

            case 'Package':
                url = `${BASE_URL}/api/status/${id}`;
                break;

            case 'FAQ':
                // console.log(id)
                url = `${BASE_URL}/api/status/${id}`;
                break;

            case 'UserList':
                url = `${BASE_URL}/api/status/${id}`;
                break;

            default:
                throw new Error('Invalid entity type');
        }

        await axios.patch(url, { status: newStatus });

        const updatedData = data.map(item => {
            if (item.id === id) {
                return { ...item, status: newStatus };
            }
            return item;
        });
        console.log(updatedData)
        setData(updatedData);
        NotificationManager.removeAll();
        NotificationManager.success(`${entityType} Status updated successfully! `);
    } catch (error) {
        console.error(error);
        NotificationManager.removeAll();
        NotificationManager.error(" An error occurred while updating the status.");
    }
};
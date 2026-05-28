import toast from 'react-hot-toast';

export const handleSuccess = (msg: string) => {
    toast.success(msg);
}

export const handleFailure = (msg: string) => {
    toast.error(msg);
}
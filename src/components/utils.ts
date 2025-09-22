export const delay = 3000; // Default delay for loading new data

export const loadNewEntityData = (entityId: string, setLoading: React.Dispatch<React.SetStateAction<boolean>>) => {
    console.log(`>>>>> Loading new data for entity ID: ${entityId}`);
    // Simulate data loading with a timeout
    setTimeout(() => {
        console.log(`>>>>> Data for entity ID ${entityId} loaded`);
        setLoading(false);
    }, delay);
};

export const reportDocumentDimensions = () => {
    const documentWidth = document.documentElement.clientWidth;
    const bodyWidth = document.body.clientWidth;
    const windowWidth = window.innerWidth;
    console.log(`>>>>>>>***** App reports Document Width: ${documentWidth}, Body Width: ${bodyWidth}, Window Width: ${windowWidth}`);
}

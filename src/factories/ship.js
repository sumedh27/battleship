export default function Ship(size) {
    const totalHP = size;
    let health = totalHP;
    let coords = null;
    let axis = null;

    function hit() {
        if (health === 0) return;
        return (health -= 1);
    }

    function getHealth() {
        return health;
    }

    function isSunk() {
        return health === 0;
    }

    function setCoords(coordinates, orientation) {
        coords = coordinates;
        axis = orientation;
    }

    const getCoords = () => {
        return { coords, axis };
    };

    return { size, totalHP, getHealth, hit, isSunk, setCoords, getCoords };
}

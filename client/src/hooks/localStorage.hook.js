export const useLocalStorage = () => {
    const setItem = (key, value) => localStorage.setItem(key, JSON.stringify(value))

    const getItemByKey = key => JSON.parse(localStorage.getItem(key))

    const removeItemByKey = key => localStorage.removeItem(key)

    const hasItem = key => Boolean(getItemByKey(key))

    return { setItem, hasItem, getItemByKey, removeItemByKey }
}
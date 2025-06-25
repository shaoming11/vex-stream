async function getEventsList() {
    try {
        const response = await fetch('https://reqres.in/api/users');
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        // const json = await response.json();

        console.log(response);
    } catch {
        console.log("Error.")
    }
}

export default getEventsList;
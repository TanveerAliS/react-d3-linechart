export async function fetchData() {
    const data = await fetch('https://konuxdata.getsandbox.com/data')
        .then(response => {
            response = response.json();
            return response;
        })
        .catch(response => {
            console.log('Error: Something went wrong ', response);
            return response;
        });
    return data;
}

export async function postData(formData) {
    const data = await fetch('http://konuxdata.getsandbox.com/points', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    })
    .then(response => {
        response = response.json();
        return response;
    })
    .catch(response => {
        console.log('Error: Something went wrong ', response);
        return response;
    });
    return data;
}
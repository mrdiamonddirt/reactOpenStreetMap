import "./App.css";
import Map from "./components/Map";
import { useEffect, useState } from "react";

export default function App() {
    const [coords, setCorrds] = useState({
        latitude: "",
        longitude: "",
    });
    const [display_name, setName] = useState("");
    const [address, setAddress] = useState({});

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            getCurrentCityName,
            error,
            options
        );
    }, []);

    function error(err) {
        if (
            err.code === 1 || //if user denied accessing the location
            err.code === 2 || //for any internal errors
            err.code === 3 //error due to timeout
        ) {
            alert(err.message);
        } else {
            alert(err);
        }
    }

    const options = {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000,
    };

    //get current location when the app loads for the first time
    function getCurrentCityName(position) {
        setCorrds({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
        });

        let url =
            "https://nominatim.openstreetmap.org/reverse?format=jsonv2" +
            "&lat=" +
            coords.latitude +
            "&lon=" +
            coords.longitude;

        fetch(url, {
            method: "GET",
            mode: "cors",
            headers: {
                "Access-Control-Allow-Origin": "https://o2cj2q.csb.app",
            },
        })
            .then((response) => response.json())
            .then((data) => setName(data.display_name));
    }

    //get input from text fields and append it to address object
    function update(field) {
        return (e) => {
            const value = e.currentTarget.value;
            setAddress((address) => ({ ...address, [field]: value }));
        };
    }

    //send the data on the state to the API
    function getData(url) {
        fetch(url, {
            method: "POST",
            mode: "cors",
            headers: {
                "Access-Control-Allow-Origin": "https://o2cj2q.csb.app",
            },
        })
            .then((response) => {
                if (response.ok) {
                    return response.json();
                }
            })
            .then((data) => {
                setName(data[0].display_name);
                setCorrds({
                    latitude: data[0].lat,
                    longitude: data[0].lon,
                });
            })
            .catch(() => error("Please Check your input"));
    }

    //set form input( data entered ) to state on form submit
    function submitHandler(e) {
        e.preventDefault();
        console.log(address);

        let url = `https://nominatim.openstreetmap.org/search?
    postalcode=${address.postalcode}&format=json`;

        getData(url);
    }

    return (
        <div className="App">
            <div className="header">
                <h1>Enter The Postal Code</h1>
                <section className="form-container">
                    <form>
                        <label>Postal code:</label>
                        <input
                            placeholder="PR2 7AJ"
                            type="text"
                            value={address.postalcode}
                            onChange={update("postalcode")}
                            id="postalcode"
                        />

                        <button onClick={(e) => submitHandler(e)}>
                            Search
                        </button>
                    </form>
                </section>
                <div className="menu">
                    <button>Click</button>
                </div>
            </div>
            <Map coords={coords} display_name={display_name} />
        </div>
    );
}

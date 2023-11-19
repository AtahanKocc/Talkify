import { useState, useEffect } from "react";

const App = () => {
    const [value, setValue] = useState(""); // Başlangıç değeri boş bir dize
    const [message, setMessage] = useState(null); // API'den gelen mesajı tutacak state
    const [previousChats, setPreviousChats] = useState([]); // Önceki sohbetleri tutacak state
    const [currentTitle, setCurrentTitle] = useState(null); // Şu anki sohbet başlığını tutacak state
    const [uniqueTitles, setUniqueTitles] = useState([]); // Benzersiz basliklari tutar

    // Yeni sohbet baslatılır
    const createNewChat = () => {
        setMessage(null);
        setValue("");
        setCurrentTitle(null);
    };

    // Baslik ustune tıklanınca cagrilan fonk.
    const handleClick = (uniqueTitle) => {
        setCurrentTitle(uniqueTitle);
        setMessage(null);
        setValue("");
    };

    // API'den mesajları alma fonksiyonu
    const getMessages = async () => {
        const options = {
            method: "POST",
            body: JSON.stringify({
                message: value,
            }),
            headers: {
                "Content-Type": "application/json",
            },
        };

        try {
            const response = await fetch('http://localhost:8000/completions', options);
            const data = await response.json();

            // API'den gelen veriyi kontrol etme
            if (data.choices && data.choices.length > 0) {
                setMessage(data.choices[0].message);
            } else {
                console.error("Invalid or empty data received from the API.");
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Component'in mount/dismount durumlarına göre çalışan useEffect
    useEffect(() => {
        console.log(currentTitle, value, message);

        // Başlangıç durumu kontrolü
        if (!currentTitle && !value && !message) {
            setCurrentTitle(value);
        }
        // Yeni bir mesaj ve yanıt geldiğinde sohbeti güncelleme
        if (currentTitle && value && message) {
            setPreviousChats(prevChats => (
                [...prevChats, {
                    title: currentTitle,
                    role: "user",
                    content: value,
                }, {
                    title: currentTitle,
                    role: message.role,
                    content: message.content,
                }]
            ));
        }
    }, [message, currentTitle, value]);

    console.log(previousChats);
// Önceki sohbetlerdeki benzersiz başlıkları güncelleme
    useEffect(() => {
        const titles = Array.from(new Set(previousChats.map(chat => chat.title)));
        setUniqueTitles(titles);
    }, [previousChats]);

    const currentChat = previousChats.filter(chat => chat.title === currentTitle);

    return (
        <div className="App">
            <section className="side-bar">
                <button onClick={createNewChat}>+ New Chat</button>
                <ul className="history">
                    {uniqueTitles.map((uniqueTitle, index) => (
                        <li key={index} onClick={() => handleClick(uniqueTitle)}>{uniqueTitle}</li>
                    ))}
                </ul>
                <nav>
                    <p>Made by Atahan Koc</p>
                </nav>
            </section>

            <section className="main">
                {!currentTitle && <h1>Talkify</h1>}
                <ul className="feed">
                    {currentChat.map((chatMessage, index) => (
                        <li key={index}>
                            <p className="role">{chatMessage.role}</p>
                            <p>{chatMessage.content}</p>
                        </li>
                    ))}
                </ul>
                <div className="bottom-section">
                    <div className="input-container">
                        <input value={value} onChange={(e) => setValue(e.target.value)} />
                        <div id="submit" onClick={getMessages}>➢</div>
                    </div>
                    <p className="info">
                        Talkify Mar 15 Version. Free Research Preview.
                    </p>
                </div>
            </section>
        </div>
    );
};

export default App;

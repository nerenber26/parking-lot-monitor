import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
    const [blocks, setBlocks] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/blocks").then((res) => {
            setBlocks(res.data);
        });
    }, []);

    return (
        <div className="p-6">
            <h1 className="text-primary text-3xl mb-4">Parking Lot Monitor</h1>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {blocks.length > 0 ? (
                    blocks.map((block) => (
                        <div key={block.id} className="bg-secondary text-white p-4 rounded-lg">
                            {block.name}
                        </div>
                    ))
                ) : (
                    <p>Loading blocks...</p>
                )}
            </div>
        </div>
    );
}

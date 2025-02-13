import { motion } from "framer-motion";

const About = () => {
    return (
        <div className="p-6">
            <h1 className="text-primary text-3xl mb-4">About</h1>
            {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center my-12">
                    <motion.img
                        src={`https://via.placeholder.com/300`}
                        alt="Example"
                        className="w-1/3"
                        initial={{ x: i % 2 === 0 ? -100 : 100, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        transition={{ duration: 0.6 }}
                    />
                    <p className="w-2/3 text-lg p-6">
                        This is section {i + 1} of the About page. It has text and an image.
                    </p>
                </div>
            ))}
        </div>
    );
};

export default About;

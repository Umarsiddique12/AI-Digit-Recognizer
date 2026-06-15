import React from 'react';

export default function About() {
  return (
    <div className="w-full max-w-4xl mx-auto px-4 slide-up" style={{ animationDelay: '0.05s' }}>
      <div className="glass gradient-border rounded-3xl p-6 md:p-8 space-y-8">
        
        {/* Section 1: Overview */}
        <div>
          <h2 className="text-2xl font-black text-white mb-3 tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
            About The Project
          </h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            This project is a deep learning-powered digit recognition web application. It connects a highly responsive React client to a Python Flask API running a Convolutional Neural Network (CNN) model built with TensorFlow/Keras. The application classifies hand-drawn digits (0-9) drawn in real-time or from uploaded images.
          </p>
        </div>

        {/* Section 2: Model Architecture */}
        <div>
          <h3 className="text-xl font-bold text-white mb-4 tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
            Convolutional Neural Network (CNN)
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            Unlike simple feedforward neural networks, CNNs capture the spatial characteristics of drawings (edges, loops, intersections). Our trained model achieves an accuracy of <span className="text-purple-400 font-semibold">98.9%</span> on the test dataset. Here is the step-by-step layer structure:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-black/25 p-4 rounded-xl border border-white/5 font-mono text-xs text-slate-300">
              <div className="text-purple-400 font-bold mb-2">Feature Extraction</div>
              <ul className="space-y-1.5 list-disc pl-4">
                <li>Conv2D (32 filters, 3x3 kernel, ReLU)</li>
                <li>MaxPooling2D (2x2 pool)</li>
                <li>Conv2D (64 filters, 3x3 kernel, ReLU)</li>
                <li>MaxPooling2D (2x2 pool)</li>
                <li>Dropout (0.25 regularization)</li>
              </ul>
            </div>
            
            <div className="bg-black/25 p-4 rounded-xl border border-white/5 font-mono text-xs text-slate-300">
              <div className="text-blue-400 font-bold mb-2">Classification Head</div>
              <ul className="space-y-1.5 list-disc pl-4">
                <li>Flatten (2D feature maps to 1D vector)</li>
                <li>Dense (128 hidden neurons, ReLU)</li>
                <li>Dropout (0.50 regularization)</li>
                <li>Dense (10 output classes, Softmax probabilities)</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Section 3: Preprocessing Pipeline */}
        <div>
          <h3 className="text-xl font-bold text-white mb-3 tracking-tight" style={{ fontFamily: 'Space Grotesk' }}>
            Image Preprocessing Pipeline
          </h3>
          <p className="text-slate-400 text-sm leading-relaxed mb-4">
            For accurate predictions, the user's input drawing is heavily preprocessed to match the MNIST dataset training format (which consists of normalized, centered 28x28 grayscale matrices):
          </p>
          
          <div className="space-y-3">
            {[
              { title: "Grayscale Conversion & Inversion", desc: "Transforms RGBA drawings to grayscale, then inverts the color. Standard drawings are dark strokes on white canvases, whereas MNIST represents white strokes on a black background." },
              { title: "Bounding Box Cropping", desc: "Locates the exact boundaries where the user drew the number and crops out empty whitespace around it, removing drawing placement bias." },
              { title: "Aspect-Ratio Scaling", desc: "Resizes the cropped digit to fit inside a 20x20 pixel bounding box while retaining the handwritten aspect ratio." },
              { title: "Centering & Padding", desc: "Centers the 20x20 pixel digit inside a 28x28 black matrix. A slight Gaussian filter is applied to blur edges, blending sharp pixels." },
              { title: "Normalization", desc: "Divides pixel values (0-255) by 255.0 to scale inputs into the range [0.0, 1.0], matching the format of training weights." }
            ].map((step, idx) => (
              <div key={idx} className="flex gap-4 p-3 bg-black/15 rounded-xl border border-white/5">
                <div className="w-6 h-6 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                  {idx + 1}
                </div>
                <div>
                  <h4 className="text-white text-xs font-semibold">{step.title}</h4>
                  <p className="text-slate-500 text-xs mt-0.5">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
      </div>
    </div>
  );
}

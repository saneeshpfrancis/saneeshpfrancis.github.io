# Undergraduate Physical Science Simple Pendulum Simulator

An interactive, high-precision, degree-level computational physics simulator designed for university students and educators in Classical Mechanics, Non-linear Dynamics, and Computational Physics.

---

## 🎯 Key Capabilities & Scientific Features

### 1. Mathematical & Theoretical Rigor
* **Full Non-Linear Equation of Motion**:
  $$\frac{d^2\theta}{dt^2} + \gamma \frac{d\theta}{dt} + c_{quad} \frac{d\theta}{dt} \left|\frac{d\theta}{dt}\right| L + \frac{g}{L} \sin\theta = \frac{\tau_{drive}(t)}{m L^2}$$
* **Exact Elliptic Integral Period Calculation**:
  Computes the exact large-amplitude period $T(\theta_0) = 4\sqrt{\frac{L}{g}} K\left(\sin\frac{\theta_0}{2}\right)$ in real time using the quadratically-converging **Arithmetic-Geometric Mean (AGM)** algorithm to $10^{-15}$ machine precision.
* **Small-Angle vs. Exact Anharmonicity Comparison**:
  Direct side-by-side comparison with the standard harmonic period $T_0 = 2\pi\sqrt{L/g}$ and Borda's series expansion.

### 2. Computational Physics & Integrator Benchmarking
Compare 4 distinct numerical integration schemes:
1. **Runge-Kutta 4th Order (RK4)**: Classical 4-stage $\mathcal{O}(\Delta t^4)$ benchmark.
2. **Velocity-Verlet**: 2nd-order symplectic integrator preserving phase space volume (Liouville's theorem) and total energy.
3. **Euler-Cromer (Semi-Implicit)**: 1st-order symplectic scheme with bounded energy oscillations.
4. **Forward Euler**: Standard explicit Euler demonstrating catastrophic artificial energy growth and unphysical spiral divergence.

### 3. Dynamic Visualizations & Vector Analysis
* **Live Vector Overlays**:
  * Tangential Velocity $\vec{v} = L \dot{\theta} \hat{u}_\theta$
  * Net Acceleration $\vec{a} = \vec{a}_{radial} + \vec{a}_{tangential}$
  * Tension Force $\vec{T} = m(g\cos\theta + L\dot{\theta}^2) (-\hat{u}_r)$
  * Gravitational Force $m\vec{g}$
* **Interactive Drag-and-Drop**:
  Click or touch and drag the bob to any angle (from $-180^\circ$ to $+180^\circ$ or even over-the-top revolutions).
* **Virtual Photogate Sensor**:
  Optical beam sensor at $\theta = 0$ measuring actual experimental period $T_{exp}$, cycle counts, and mean periods.

### 4. Multi-Mode Scientific Oscilloscope
* **Kinematics**: Real-time continuous traces of $\theta(t)$, $\omega(t)$, and $\alpha(t)$.
* **Energy & Drift**: Instantaneous Kinetic Energy ($T$), Potential Energy ($V$), Total Energy ($E_{tot}$), and relative energy drift $\Delta E / E_0 (\%)$. Includes an instantaneous vertical energy bar gauge.
* **Phase Space ($\theta$ vs. $\omega$)**: Live phase trajectory, full vector flow field $(\dot{\theta}, \dot{\omega})$, and theoretical **Separatrix** curves ($\omega_{sep}(\theta) = \pm 2\sqrt{g/L}\cos(\theta/2)$) illustrating the boundary between libration and rotation.
* **Fast Fourier Transform (FFT)**: On-the-fly discrete power spectrum revealing odd harmonic peaks ($3f_0, 5f_0, \dots$) as amplitude enters the non-linear regime.

### 5. Laboratory Data Logging & Export
* Real-time tabular data streaming $(t, \theta, \omega, \alpha, KE, PE, E_{tot}, T_{tension})$.
* Single-click **CSV export** formatted for Jupyter Notebook, Python (Pandas/SciPy), MATLAB, or Excel.

---

## 🚀 How to Run

Because this simulator is built with pure standards-compliant HTML5, Canvas 2D, and vanilla JavaScript:
1. Simply double-click **`index.html`** in any modern web browser (Chrome, Firefox, Edge, Safari).
2. No installation, build step, npm packages, or internet connection are required.
3. To serve locally over HTTP (optional):
   ```bash
   python -m http.server 8000
   # Open http://localhost:8000 in your browser
   ```

---

## 🔬 Undergraduate Laboratory Exercises

### Experiment 1: Large-Angle Anharmonicity & Elliptic Period Validation
* **Objective**: Measure the deviation of the pendulum's period from the simple harmonic approximation $T_0 = 2\pi\sqrt{L/g}$ as initial amplitude $\theta_0$ increases.
* **Procedure**:
  1. Set $L = 1.0\text{ m}$, $m = 1.0\text{ kg}$, $g = 9.807\text{ m/s}^2$, and damping $\gamma = 0$.
  2. Test angles: $\theta_0 \in \{5^\circ, 20^\circ, 45^\circ, 60^\circ, 90^\circ, 120^\circ, 150^\circ\}$.
  3. Allow 3 cycles and record the measured photogate period $T_{\text{meas}}$.
  4. Compare against the exact AGM elliptic integral value and Borda's approximation:
     $$\frac{T}{T_0} \approx 1 + \frac{1}{16}\theta_0^2 + \frac{11}{3072}\theta_0^4$$
  5. Plot $T/T_0$ vs. $\theta_0$ in Python or Excel.

### Experiment 2: Symplectic vs. Non-Symplectic Integrator Stability
* **Objective**: Understand Liouville's theorem and energy conservation in numerical integration.
* **Procedure**:
  1. Set $\theta_0 = 45^\circ$, damping $\gamma = 0$.
  2. Select **Forward Euler** and click the **Energy** tab. Observe the total energy curve rapidly drifting upward (artificial energy generation).
  3. Reset and select **Velocity-Verlet** or **Euler-Cromer**. Observe how the total energy remains tightly bounded over hundreds of cycles.
  4. Compare with **RK4** and record the energy drift percentage $\Delta E / E_0$.

### Experiment 3: Phase Space Topology & The Separatrix
* **Objective**: Map libration (oscillations) vs. rotation (whirling) and verify the separatrix boundary.
* **Procedure**:
  1. Switch to the **Phase Space** chart tab.
  2. Click preset **3. Separatrix & Inverted ($\theta_0 = 179.5^\circ$)**.
  3. Observe how the trajectory hugs the dashed golden Separatrix curve and experiences critical slowing down ($T \to \infty$) near the saddle point $(\pm \pi, 0)$.
  4. Give the bob an initial angular velocity $\omega_0 > 2\sqrt{g/L}$. Observe how the trajectory enters the unbounded rotation regime above the separatrix.

### Experiment 4: Harmonic Generation via Fast Fourier Transform (FFT)
* **Objective**: Demonstrate that non-linearity ($\sin\theta \approx \theta - \theta^3/6$) introduces higher odd harmonics.
* **Procedure**:
  1. Switch to the **FFT Spectrum** tab.
  2. Start with small amplitude $\theta_0 = 5^\circ$. Verify a single sharp spike at fundamental frequency $f_0 = 1 / T_0$.
  3. Increase amplitude to $\theta_0 = 120^\circ$. Observe the emergence of the 3rd harmonic ($3f_0$) and 5th harmonic ($5f_0$) in the power spectrum.

### Experiment 5: Driven Damped Oscillations & Deterministic Chaos
* **Objective**: Observe strange attractors in non-linear dynamical systems.
* **Procedure**:
  1. Click preset **7. Deterministic Chaos** ($\gamma = 0.5$, $\tau_0 = 1.2$, $\Omega = 2/3\text{ rad/s}$).
  2. Open the **Phase Space** tab.
  3. Watch the continuous non-repeating trajectory fold and stretch in phase space, demonstrating sensitivity to initial conditions.

---

## 📁 File Structure

```
.
├── index.html       # Laboratory UI layout, panels, controls & theory modal
├── style.css        # Scientific dark-mode stylesheet & responsive grid
├── physics.js       # Mathematical physics engine (RK4, Verlet, Euler, AGM Elliptic, FFT)
├── renderer.js      # 2D Canvas rendering (mechanical assembly, vectors, photogate, trails)
├── charts.js        # High-performance live oscilloscope, energy, phase space, & FFT charts
├── app.js           # Main application coordinator, event wiring, and CSV data export
└── README.md        # Lab manual, theory, derivations, and experiment exercises
```

---

## 📜 References
1. Landau, L. D., & Lifshitz, E. M. (1976). *Mechanics* (Course of Theoretical Physics, Vol. 1). Butterworth-Heinemann.
2. Marion, J. B., & Thornton, S. T. (2004). *Classical Dynamics of Particles and Systems*. Brooks/Cole.
3. Press, W. H., Teukolsky, S. A., Vetterling, W. T., & Flannery, B. P. (2007). *Numerical Recipes: The Art of Scientific Computing* (3rd ed.). Cambridge University Press.
4. Baker, G. L., & Blackburn, J. A. (2005). *The Pendulum: A Case Study in Physics*. Oxford University Press.

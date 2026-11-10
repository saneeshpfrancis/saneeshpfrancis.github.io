# 🧪 Projectile Motion Laboratory Manual & Theory Guide

This manual serves as a formal physics curriculum guide for high school and university physics laboratory courses using this simulation.

---

## 📚 Section 1: Theoretical Background

### 1.1 Ideal Vacuum Kinematics (Level 1 - Basic)
In a vacuum near the surface of the Earth, gravitational acceleration is constant and directed downwards:
$$\vec{a}(t) = \begin{bmatrix} a_x \\ a_y \end{bmatrix} = \begin{bmatrix} 0 \\ -g \end{bmatrix}$$
where $g = 9.80665\text{ m/s}^2 \approx 9.81\text{ m/s}^2$.

Given initial launch velocity $v_0$, angle of elevation $\theta$, and initial launch height $h_0$:
$$v_{x0} = v_0 \cos\theta$$
$$v_{y0} = v_0 \sin\theta$$

Integrating acceleration with respect to time:
$$v_x(t) = v_{x0} = v_0 \cos\theta \quad \text{(Constant)}$$
$$v_y(t) = v_{y0} - gt = v_0 \sin\theta - gt$$

Integrating velocity with respect to time yields position coordinates:
$$x(t) = x_0 + v_{x0} t = (v_0 \cos\theta) t$$
$$y(t) = h_0 + v_{y0} t - \frac{1}{2}gt^2 = h_0 + (v_0 \sin\theta) t - \frac{1}{2}gt^2$$

#### Trajectory Equation $y(x)$:
Eliminating $t = \frac{x}{v_0 \cos\theta}$:
$$y(x) = h_0 + x \tan\theta - \frac{g x^2}{2 v_0^2 \cos^2\theta}$$
Since this is quadratic in $x$ with negative coefficient for $x^2$, the path is a downward-opening parabola.

#### Peak (Apex):
At maximum height, vertical velocity reaches instantaneous rest ($v_y = 0$):
$$t_{\text{apex}} = \frac{v_0 \sin\theta}{g}$$
$$H_{\text{max}} = y(t_{\text{apex}}) = h_0 + \frac{v_0^2 \sin^2\theta}{2g}$$

#### Total Flight Time $T$ and Range $R$:
Setting $y(T) = 0$:
$$-\frac{1}{2}g T^2 + (v_0 \sin\theta) T + h_0 = 0$$
Using the quadratic formula:
$$T = \frac{v_0 \sin\theta + \sqrt{v_0^2 \sin^2\theta + 2gh_0}}{g}$$

When $h_0 = 0$:
$$T = \frac{2 v_0 \sin\theta}{g}$$
$$R = x(T) = (v_0 \cos\theta) \left(\frac{2 v_0 \sin\theta}{g}\right) = \frac{v_0^2 \sin(2\theta)}{g}$$

#### Optimal Angle of Maximum Range:
- **Flat Ground ($h_0 = 0$)**: Range $R$ is maximized when $\sin(2\theta) = 1 \implies 2\theta = 90^\circ \implies \theta = 45^\circ$.
- **Elevated Launcher ($h_0 > 0$)**: Taking $\frac{dR}{d\theta} = 0$:
$$\theta_{\text{opt}} = \arcsin\left(\frac{1}{\sqrt{2 + \frac{2gh_0}{v_0^2}}}\right) < 45^\circ$$

---

### 1.2 Conservation of Mechanical Energy (Level 2 - Intermediate)
In the absence of non-conservative forces (like air resistance), mechanical energy $E$ is conserved at every point along the trajectory:
$$E = KE(t) + PE(t) = \frac{1}{2}m v(t)^2 + mgy(t) = \text{Constant}$$
At launch ($t = 0$):
$$E_0 = \frac{1}{2}m v_0^2 + mgh_0$$
At ground impact ($y = 0$):
$$\frac{1}{2}m v_{\text{impact}}^2 = \frac{1}{2}m v_0^2 + mgh_0 \implies v_{\text{impact}} = \sqrt{v_0^2 + 2gh_0}$$
Note that in a vacuum, the impact speed is completely independent of launch angle $\theta$!

---

### 1.3 Aerodynamic Drag & Terminal Velocity (Level 3 - Advance)
When moving through a fluid medium with density $\rho$, the object experiences a resistive drag force that opposes relative velocity $\vec{v}_{\text{rel}}$:
$$\vec{F}_{\text{drag}} = -\frac{1}{2} \rho C_d A |\vec{v}_{\text{rel}}| \vec{v}_{\text{rel}}$$
Where:
- $\rho$: Fluid density ($\text{kg/m}^3$)
- $C_d$: Dimensionless drag coefficient (e.g. $0.47$ for a smooth sphere)
- $A$: Cross-sectional frontal area ($A = \pi r^2 = \pi \frac{d^2}{4}$ for a sphere)
- $\vec{v}_{\text{rel}} = \vec{v} - \vec{v}_{\text{wind}}$

The system of coupled differential equations:
$$\frac{d v_x}{dt} = -\frac{\rho C_d A}{2m} |\vec{v}_{\text{rel}}| (v_x - v_{\text{wind}, x})$$
$$\frac{d v_y}{dt} = -g - \frac{\rho C_d A}{2m} |\vec{v}_{\text{rel}}| (v_y - v_{\text{wind}, y})$$

Because these equations are non-linear, no closed-form elementary analytical solution exists. Numerical integration methods (such as the 4th-Order Runge-Kutta solver implemented in this simulation) must be employed.

#### Terminal Velocity:
During pure vertical descent ($v_x = 0$), drag force eventually balances gravity:
$$\frac{1}{2}\rho C_d A v_t^2 = mg \implies v_t = \sqrt{\frac{2mg}{\rho C_d A}}$$
Once $|v_y| \to v_t$, acceleration drops to zero and the object falls at constant velocity.

---

### 1.4 Numerical Integration Comparison
- **Forward Euler**:
  $$v_{n+1} = v_n + a_n \Delta t$$
  $$x_{n+1} = x_n + v_n \Delta t$$
  *Error per step*: $\mathcal{O}(\Delta t^2)$. *Global error*: $\mathcal{O}(\Delta t)$. Artificial energy creation observed in oscillatory and ballistic motion.
- **Runge-Kutta 4 (RK4)**:
  Takes 4 intermediate evaluations per time step with Simpson's rule weighting:
  $$k_1 = f(t_n, y_n)$$
  $$k_2 = f(t_n + \frac{\Delta t}{2}, y_n + \frac{\Delta t}{2} k_1)$$
  $$k_3 = f(t_n + \frac{\Delta t}{2}, y_n + \frac{\Delta t}{2} k_2)$$
  $$k_4 = f(t_n + \Delta t, y_n + \Delta t k_3)$$
  $$y_{n+1} = y_n + \frac{\Delta t}{6}(k_1 + 2k_2 + 2k_3 + k_4)$$
  *Local truncation error*: $\mathcal{O}(\Delta t^5)$. *Global error*: $\mathcal{O}(\Delta t^4)$.

---

## 📝 Section 2: Guided Laboratory Experiments

### Experiment 1: Complementary Angles and Range Maximization
1. **Hypothesis**: For a fixed launch speed $v_0$ from ground level ($h_0 = 0$), two angles that sum to $90^\circ$ ($\theta_1 + \theta_2 = 90^\circ$) will produce identical horizontal ranges.
2. **Procedure**:
   - Set $v_0 = 20\text{ m/s}, h_0 = 0\text{ m}$, select Earth in vacuum (Level 1).
   - Fire at $\theta = 15^\circ$ and $\theta = 75^\circ$. Record Range.
   - Fire at $\theta = 30^\circ$ and $\theta = 60^\circ$. Record Range.
   - Fire at $\theta = 45^\circ$. Record Range.
3. **Data Verification**:
   - $\sin(2 \times 30^\circ) = \sin(60^\circ) = \frac{\sqrt{3}}{2} \approx 0.866$
   - $\sin(2 \times 60^\circ) = \sin(120^\circ) = \frac{\sqrt{3}}{2} \approx 0.866$
   - Observe that both land at $R = \frac{20^2 \times 0.866}{9.81} \approx 35.31\text{ m}$.
   - At $45^\circ$, $\sin(90^\circ) = 1.0$, producing maximum range $R = 40.77\text{ m}$.

### Experiment 2: The Elevated Launcher Optimal Angle
1. Set pedestal height to $h_0 = 10\text{ m}$ with $v_0 = 20\text{ m/s}$.
2. Fire at $45^\circ$, then sweep from $30^\circ$ to $44^\circ$ in steps of $1^\circ$.
3. Compute the theoretical optimal angle:
   $$\theta_{\text{opt}} = \arcsin\left(\frac{1}{\sqrt{2 + \frac{2 \times 9.81 \times 10}{20^2}}}\right) = \arcsin\left(\frac{1}{\sqrt{2.4905}}\right) = \arcsin(0.6337) \approx 39.3^\circ$$
4. Verify that $39.3^\circ$ produces a longer range than $45^\circ$!

### Experiment 3: Aerodynamic Ballistic Asymmetry
1. Switch to Level 3 (Advance Level). Enable Air Resistance.
2. Fire the **Cannonball** at $v_0 = 25\text{ m/s}, \theta = 50^\circ$.
3. Clear trails and fire the **Feather / Chute** at identical initial parameters.
4. Compare telemetry curves on the Position and Velocity graphs:
   - Notice the feather's horizontal velocity $v_x$ drops rapidly toward zero.
   - Observe the vertical velocity $v_y$ asymptoting to terminal velocity rather than decreasing linearly.

(() => {
  "use strict";

  const sources = {
    gevs: "GSFC-STD-7000B · active public baseline checked July 2026",
    ecss: "ECSS-E-ST-10-03C Rev.1 · Testing · 31 May 2022",
    nasaVibe: "NASA-STD-7001B · Payload Vibroacoustic Test Criteria",
    project: "Controlled project verification and test documentation",
    practice: "Spacecraft environmental-test practice · confirm project tailoring",
    astm: "ASTM E595 / project materials and contamination requirements",
    emc: "Applicable EMC control plan and equipment-level standard",
    people: "Public team listing · checked 10 July 2026"
  };

  const links = {
    gevs: "https://standards.nasa.gov/standard/GSFC/GSFC-STD-7000",
    ecss: "https://ecss.nl/standard/ecss-e-st-10-03c-rev-1-testing-31-may-2022/",
    nasaVibe: "https://standards.nasa.gov/standard/NASA/NASA-STD-7001"
  };

  window.REFERENCE_DECK = [
    {
      id: "std-01", category: "Standards & tailoring", level: "Foundation",
      question: "What is the purpose of GSFC-STD-7000B, commonly called GEVS?",
      answer: "It provides a baseline and implementation guidance for environmental verification of GSFC payloads, subsystems and components, including demonstration of mission-environment performance and minimum workmanship.",
      detail: "It is a starting point for developing project environmental requirements, not a substitute for the project's approved requirements. The NASA standards system lists Revision B, dated 28 April 2021, as active.",
      source: sources.gevs, sourceUrl: links.gevs
    },
    {
      id: "std-02", category: "Standards & tailoring", level: "Foundation",
      question: "What does ECSS-E-ST-10-03C Rev.1 cover?",
      answer: "Ground testing used to verify space-segment elements and equipment before launch, including qualification, acceptance and protoflight approaches, test management, margins, tolerances, uncertainties and test documentation.",
      detail: "Its scope does not make every clause automatically applicable. ECSS explicitly permits project tailoring, and discipline-specific standards may add detailed requirements.",
      source: sources.ecss, sourceUrl: links.ecss
    },
    {
      id: "std-03", category: "Standards & tailoring", level: "Working", 
      question: "If a handbook table and the approved project test specification give different levels, which one controls?",
      answer: "The approved, configuration-controlled project requirement controls, provided the tailoring and approval route is valid.",
      detail: "Raise the discrepancy before test. Record the governing requirement identifier, revision, rationale and approval rather than quietly selecting the more convenient value.",
      source: sources.project
    },
    {
      id: "std-04", category: "Standards & tailoring", level: "Working",
      question: "Why is quoting a test level without its model philosophy dangerous?",
      answer: "Because the same environment may have different qualification, protoflight, acceptance or workmanship levels and durations. A number without model, axis, duration, margin and configuration is incomplete.",
      detail: "A useful level statement includes the item/model, environment, spectrum or temperature, duration or cycles, operational state, tolerances, axes and governing source.",
      source: sources.practice
    },
    {
      id: "std-05", category: "Standards & tailoring", level: "Foundation",
      question: "What is tailoring?",
      answer: "The documented selection, modification or deletion of baseline requirements to suit the mission, hardware, risk posture and verification strategy.",
      detail: "Tailoring is an engineering and approval process. It is not an informal decision made during setup, and it should remain traceable to rationale and authority.",
      source: sources.ecss, sourceUrl: links.ecss
    },
    {
      id: "std-06", category: "Standards & tailoring", level: "Lead",
      question: "Before using MIL-STD-1540 on a new programme, what must you establish?",
      answer: "The exact contractual revision, status, invoked clauses, approved tailoring and relationship to newer customer or project requirements.",
      detail: "Legacy military space standards are still referenced in industry, but applicability is contractual. Never rely on the familiar document number alone.",
      source: sources.project
    },
    {
      id: "std-07", category: "Standards & tailoring", level: "Working",
      question: "What is the difference between a standard and a test procedure?",
      answer: "A standard states baseline requirements and methods; a procedure translates applicable requirements into controlled, executable steps for a particular article, facility and configuration.",
      detail: "A good procedure preserves requirement traceability while defining instrumentation, tolerances, sequence, hold points, aborts, functional checks and data products.",
      source: sources.project
    },
    {
      id: "std-08", category: "Standards & tailoring", level: "Lead",
      question: "What should you say when asked for an exact programme level that is not in an approved source?",
      answer: "State that the value is not yet controlled, identify the source needed, and provide only a clearly labelled planning assumption if authorised.",
      detail: "False precision creates risk. Separate remembered baseline guidance from a verified project requirement and record any assumption with an owner and closure date.",
      source: sources.project
    },

    {
      id: "ver-01", category: "Verification strategy", level: "Foundation",
      question: "What is the main purpose of qualification testing?",
      answer: "To demonstrate with adequate margin that the design can withstand the specified life-cycle environments and still meet functional and performance requirements.",
      detail: "Qualification primarily addresses design adequacy. The test article and configuration must be sufficiently representative for the evidence to be valid.",
      source: sources.practice
    },
    {
      id: "ver-02", category: "Verification strategy", level: "Foundation",
      question: "What is the main purpose of acceptance testing?",
      answer: "To screen flight hardware for workmanship and latent defects and confirm it is ready for use without consuming unacceptable life.",
      detail: "Acceptance is not simply a shorter qualification test. Its level, duration and sequence are selected for flight-item screening and must follow the approved philosophy.",
      source: sources.practice
    },
    {
      id: "ver-03", category: "Verification strategy", level: "Foundation",
      question: "What is protoflight testing?",
      answer: "A strategy in which the flight article also provides qualification evidence, normally using a defined protoflight level and duration followed by acceptance of the resulting risk.",
      detail: "It can reduce dedicated hardware and schedule but places greater importance on test control, margins, life consumption, anomaly handling and the representativeness of the flight article.",
      source: sources.ecss, sourceUrl: links.ecss
    },
    {
      id: "ver-04", category: "Verification strategy", level: "Working",
      question: "Why are functional checks normally performed before and after an environmental exposure?",
      answer: "The pre-test check establishes a valid baseline; the post-test check determines whether exposure changed function or performance.",
      detail: "Where required, monitoring during exposure can reveal intermittent or environment-dependent failures that disappear after the test stops.",
      source: sources.practice
    },
    {
      id: "ver-05", category: "Verification strategy", level: "Working",
      question: "What does MPE mean in environmental verification?",
      answer: "Maximum Predicted Environment: the best controlled estimate of the most severe environment the item is expected to experience at its location and configuration.",
      detail: "The project defines how uncertainty and margin are applied to the MPE to derive test levels. Do not assume one universal margin across every environment.",
      source: sources.practice
    },
    {
      id: "ver-06", category: "Verification strategy", level: "Lead",
      question: "Why must test input tolerance and measurement uncertainty be considered separately?",
      answer: "Tolerance defines the allowed achieved test condition; uncertainty describes doubt in the measurement. Ignoring either can produce an apparent pass that did not meet the requirement—or unnecessary overtest.",
      detail: "The procedure should define how uncertainty is treated in control, acceptance and reporting, including the relevant calibration and data-processing chain.",
      source: sources.ecss, sourceUrl: links.ecss
    },
    {
      id: "ver-07", category: "Verification strategy", level: "Working",
      question: "What makes an environmental test configuration representative?",
      answer: "Correct flight-like structural interfaces, mass properties, harness routing, fasteners, software, operating states, thermal boundaries and required support equipment—or justified simulations of them.",
      detail: "Representativeness is environment-specific. A configuration adequate for EMC may not be adequate for vibration or thermal balance.",
      source: sources.project
    },
    {
      id: "ver-08", category: "Verification strategy", level: "Lead",
      question: "What is the first question after a test anomaly?",
      answer: "Is the article and facility safe, and should the test be stopped or held? Only then protect evidence and begin diagnosis.",
      detail: "Preserve raw data, timestamps, configuration, photographs, logs and operator observations. Avoid uncontrolled retesting that can erase the failure signature.",
      source: sources.practice
    },
    {
      id: "ver-09", category: "Verification strategy", level: "Lead",
      question: "When is retest evidence credible after a failure?",
      answer: "When the cause, corrective action, affected requirements, configuration and retest scope are documented and approved, and the retest demonstrates the intended verification objective.",
      detail: "A simple rerun that passes does not automatically invalidate the original failure or prove the fix.",
      source: sources.ecss, sourceUrl: links.ecss
    },
    {
      id: "ver-10", category: "Verification strategy", level: "Lead",
      question: "Why does environmental test sequence matter?",
      answer: "Earlier environments can reveal or create defects that later tests screen, while some tests consume life or alter the article. Sequence affects both realism and diagnostic value.",
      detail: "The project should define sequence and permitted deviations. Consider cumulative exposure, contamination risk, access for inspection and post-test functional opportunities.",
      source: sources.project
    },

    {
      id: "vib-01", category: "Vibration & acoustics", level: "Foundation",
      question: "What are the usual units of an acceleration power spectral density?",
      answer: "g²/Hz, describing mean-square acceleration per unit bandwidth.",
      detail: "The overall random-vibration level is obtained by integrating the PSD over frequency and taking the square root, giving g RMS.",
      source: sources.nasaVibe, sourceUrl: links.nasaVibe
    },
    {
      id: "vib-02", category: "Vibration & acoustics", level: "Working",
      question: "How is overall g RMS calculated from a random-vibration PSD?",
      answer: "Integrate the PSD over the specified frequency range to obtain mean-square acceleration, then take the square root.",
      detail: "For piecewise log-log spectra, integrate each segment using its power-law slope rather than multiplying a plotted average by bandwidth.",
      source: sources.nasaVibe, sourceUrl: links.nasaVibe
    },
    {
      id: "vib-03", category: "Vibration & acoustics", level: "Working",
      question: "What does a +3 dB/octave PSD slope mean?",
      answer: "The PSD doubles for each doubling of frequency.",
      detail: "For PSD, 10 log₁₀(P₂/P₁) is used. A doubling is about +3.01 dB. Do not use the 20 log amplitude relationship for PSD ratios.",
      source: sources.practice
    },
    {
      id: "vib-04", category: "Vibration & acoustics", level: "Working",
      question: "What is the difference between control and response accelerometers?",
      answer: "Control channels regulate or limit the shaker input; response channels measure how the test article and fixture react to that input.",
      detail: "Channel roles, averaging strategy, abort limits and failed-channel behaviour must be agreed before test. A response channel should not silently become a control channel.",
      source: sources.practice
    },
    {
      id: "vib-05", category: "Vibration & acoustics", level: "Lead",
      question: "What is notching in a vibration test?",
      answer: "Intentional reduction of the commanded input over a frequency region to prevent an interface force, response or other protected quantity exceeding an approved limit.",
      detail: "Notching criteria need pre-agreed rationale, channels, limits and authority. It is controlled tailoring of the applied test, not an operator hiding an inconvenient resonance.",
      source: sources.practice
    },
    {
      id: "vib-06", category: "Vibration & acoustics", level: "Lead",
      question: "How does force limiting differ from response limiting?",
      answer: "Force limiting controls the dynamic interface load transmitted into the article; response limiting protects a measured response such as acceleration or strain at a specific location.",
      detail: "Both can reduce overtest, but they use different physical evidence and require justified limits and instrumentation.",
      source: sources.nasaVibe, sourceUrl: links.nasaVibe
    },
    {
      id: "vib-07", category: "Vibration & acoustics", level: "Lead",
      question: "Why can a poor vibration fixture invalidate a test?",
      answer: "Fixture flexibility, modes, damping, mass and interface distortion can change the applied environment, create local overtest, hide required input or exceed shaker capability.",
      detail: "Fixture design and verification should address stiffness, first modes, load paths, fastener access, control locations, mass properties and cross-axis response.",
      source: sources.practice
    },
    {
      id: "vib-08", category: "Vibration & acoustics", level: "Working",
      question: "What is a low-level sine survey used for?",
      answer: "To identify resonant frequencies and response changes without applying the full qualification or acceptance exposure.",
      detail: "Comparing pre- and post-test surveys can indicate structural change, but shifts must be assessed against measurement repeatability, boundary conditions and defined criteria.",
      source: sources.practice
    },
    {
      id: "vib-09", category: "Vibration & acoustics", level: "Working",
      question: "Why monitor cross-axis vibration during a single-axis test?",
      answer: "Fixture and article dynamics can produce significant off-axis responses that threaten hardware or reveal an unrepresentative setup.",
      detail: "Cross-axis limits and actions should be defined in advance. A nominally single-axis shaker test is not physically one-dimensional.",
      source: sources.practice
    },
    {
      id: "vib-10", category: "Vibration & acoustics", level: "Foundation",
      question: "What does OASPL represent in an acoustic test?",
      answer: "Overall Sound Pressure Level: the logarithmic combination of sound-pressure energy across the specified frequency bands.",
      detail: "Band levels cannot be arithmetically averaged. Convert each band from decibels to linear energy, sum, then convert back to decibels.",
      source: sources.nasaVibe, sourceUrl: links.nasaVibe
    },
    {
      id: "vib-11", category: "Vibration & acoustics", level: "Working",
      question: "What happens to a total sound level when two equal, uncorrelated acoustic energy levels are combined?",
      answer: "The total rises by approximately 3 dB.",
      detail: "A 3 dB increase is a doubling of mean-square pressure or acoustic energy, not a doubling of pressure amplitude.",
      source: sources.practice
    },
    {
      id: "vib-12", category: "Vibration & acoustics", level: "Lead",
      question: "What should be checked before increasing from a low-level run to full vibration level?",
      answer: "Control quality, response behaviour, cross-axis levels, fixture and article condition, channel health, abort margins, shaker limits and agreement that the setup matches the approved configuration.",
      detail: "Use staged level increments when required. Review data rather than treating the low-level run as a ceremonial step.",
      source: sources.practice
    },

    {
      id: "shk-01", category: "Shock", level: "Foundation",
      question: "What does a Shock Response Spectrum describe?",
      answer: "The peak response of a family of ideal single-degree-of-freedom oscillators to a measured shock, plotted against natural frequency for a stated damping or Q.",
      detail: "An SRS is a severity representation, not a unique time history. Different waveforms can produce similar spectra.",
      source: sources.practice
    },
    {
      id: "shk-02", category: "Shock", level: "Working",
      question: "Why must the SRS damping or Q value be stated?",
      answer: "Because oscillator damping changes the calculated peak responses and therefore the spectrum. Spectra with different Q values are not directly comparable.",
      detail: "For lightly damped systems, Q is approximately 1/(2ζ), where ζ is the damping ratio.",
      source: sources.practice
    },
    {
      id: "shk-03", category: "Shock", level: "Working",
      question: "Why is sampling rate especially important for pyroshock measurement?",
      answer: "Pyroshock contains high-frequency, short-duration content. Insufficient sampling or anti-alias filtering can distort peaks and the calculated SRS.",
      detail: "Review the complete measurement chain: sensor resonance, mounting, conditioner bandwidth, anti-alias filter, sample rate, record length and processing settings.",
      source: sources.practice
    },
    {
      id: "shk-04", category: "Shock", level: "Lead",
      question: "Why is accelerometer mounting critical in shock testing?",
      answer: "Poor mounting can introduce local resonance, rocking, cable interaction or loss of high-frequency fidelity, creating misleading peak and SRS results.",
      detail: "Use a qualified mounting method, suitable sensor range and mass, secure cables, and document orientation and location.",
      source: sources.practice
    },
    {
      id: "shk-05", category: "Shock", level: "Working",
      question: "Can meeting an SRS prove the time waveform is representative?",
      answer: "No. SRS agreement alone does not guarantee representative duration, polarity, energy distribution, number of events or time-domain characteristics.",
      detail: "The test requirement should define any additional waveform, duration, tolerance or event-count constraints.",
      source: sources.project
    },
    {
      id: "shk-06", category: "Shock", level: "Lead",
      question: "What is a common danger when mechanically simulating pyroshock?",
      answer: "Achieving the target spectrum at control points while producing an unrealistic local input, excessive low-frequency energy or damaging interface loads elsewhere.",
      detail: "Use multiple measurement locations, pre-test analysis or development runs, and approved limiting criteria where required.",
      source: sources.practice
    },
    {
      id: "shk-07", category: "Shock", level: "Lead",
      question: "After an unexpected shock response, what evidence should be preserved before rerunning?",
      answer: "Raw unfiltered time histories, acquisition settings, calibration, trigger data, sensor mounting, photographs, configuration, event observations and all processed spectra.",
      detail: "Reprocessing cannot recover bandwidth or samples that were never captured. Protect the original data and processing recipe.",
      source: sources.practice
    },

    {
      id: "thm-01", category: "Thermal & vacuum", level: "Foundation",
      question: "How does thermal-vacuum cycling differ from thermal-balance testing?",
      answer: "Thermal-vacuum cycling verifies workmanship and operation through temperature extremes in vacuum; thermal balance correlates the thermal model under controlled steady boundary conditions.",
      detail: "A campaign may combine objectives, but the success criteria, instrumentation and dwell/stability logic must remain explicit.",
      source: sources.practice
    },
    {
      id: "thm-02", category: "Thermal & vacuum", level: "Working",
      question: "What is the difference between thermal stabilisation and dwell?",
      answer: "Stabilisation is reaching the defined temperature or rate-of-change condition at specified sensors; dwell is the required time maintained after that condition is achieved.",
      detail: "Starting the dwell when chamber air or shroud reaches setpoint can under-test hardware with significant thermal lag.",
      source: sources.practice
    },
    {
      id: "thm-03", category: "Thermal & vacuum", level: "Working",
      question: "Why must hot and cold plateaus identify the controlling temperature sensors?",
      answer: "Different parts of the article heat and cool at different rates. Named control or soak sensors make plateau entry objective and repeatable.",
      detail: "The sensor set should represent thermally slow, critical and operationally limited locations, not merely the easiest points to instrument.",
      source: sources.project
    },
    {
      id: "thm-04", category: "Thermal & vacuum", level: "Lead",
      question: "Why can chamber pressure alone be an inadequate TVAC success criterion?",
      answer: "Pressure confirms the vacuum environment but not article temperature, thermal stability, functional state, leakage, arcing risk or completion of required operations.",
      detail: "Success criteria should combine pressure, temperatures, time, functional results, alarms, data completeness and any contamination controls.",
      source: sources.practice
    },
    {
      id: "thm-05", category: "Thermal & vacuum", level: "Working",
      question: "What is a hot or cold operational start intended to demonstrate?",
      answer: "That the hardware can start and reach required function from the specified temperature extreme, not merely continue operating after being started under benign conditions.",
      detail: "The power-off duration, temperature criterion, start sequence, loads and pass/fail parameters must be defined.",
      source: sources.project
    },
    {
      id: "thm-06", category: "Thermal & vacuum", level: "Lead",
      question: "What is the danger of using the fastest possible thermal transition?",
      answer: "It may create unrepresentative gradients, exceed hardware limits, mask thermal lag or turn a workmanship screen into an unintended structural test.",
      detail: "The approved ramp rate should reflect verification intent, facility capability, article response and any specified maximum gradients.",
      source: sources.practice
    },
    {
      id: "thm-07", category: "Thermal & vacuum", level: "Working",
      question: "Why should thermocouple installation be inspected and documented?",
      answer: "Location, attachment, contact quality, wire routing and thermal conduction can materially affect the measured temperature and the conclusions drawn from it.",
      detail: "Photographs and a channel map support configuration control, troubleshooting and repeatability.",
      source: sources.practice
    },
    {
      id: "thm-08", category: "Thermal & vacuum", level: "Lead",
      question: "What does thermal-model correlation require beyond matching one temperature?",
      answer: "Comparison across representative nodes, operating cases and transient or steady conditions, with differences assessed against model assumptions, uncertainty and acceptance criteria.",
      detail: "A single good match can hide compensating errors. Preserve heater powers, boundary conditions, dissipation states and sensor uncertainties.",
      source: sources.practice
    },
    {
      id: "thm-09", category: "Thermal & vacuum", level: "Working",
      question: "Why are pressure-dependent electrical risks considered during pump-down and venting?",
      answer: "Some voltage and spacing combinations can be more susceptible to gas discharge at intermediate pressures than at atmosphere or high vacuum.",
      detail: "Control powered states and transitions according to the approved electrical and vacuum-safety rules, including hold points where needed.",
      source: sources.practice
    },
    {
      id: "thm-10", category: "Thermal & vacuum", level: "Lead",
      question: "What should happen if a required TVAC data channel fails during a plateau?",
      answer: "Follow the pre-agreed channel criticality and contingency: hold or stop if the verification objective or safety cannot be demonstrated; otherwise document and obtain authorised disposition.",
      detail: "Do not redefine a critical sensor as non-critical after failure without technical justification and approval.",
      source: sources.project
    },

    {
      id: "con-01", category: "Contamination & cleanliness", level: "Foundation",
      question: "What do TML and CVCM mean in materials outgassing screening?",
      answer: "TML is Total Mass Loss; CVCM is Collected Volatile Condensable Material under the specified test method.",
      detail: "They address different concerns: total volatile loss and the fraction likely to condense on a collector. Results are method- and preparation-dependent.",
      source: sources.astm
    },
    {
      id: "con-02", category: "Contamination & cleanliness", level: "Working",
      question: "What commonly used NASA screening values are associated with ASTM E595 data?",
      answer: "TML no greater than 1.0% and CVCM no greater than 0.10% are common screening values—but they are not universal project acceptance limits.",
      detail: "Use the project materials requirements, consider water-vapour effects and application-specific sensitivity, and verify the tested material formulation and cure state.",
      source: sources.astm
    },
    {
      id: "con-03", category: "Contamination & cleanliness", level: "Working",
      question: "What is the purpose of a bakeout?",
      answer: "To reduce volatile contamination by holding hardware or materials at controlled temperature and pressure for a defined time before sensitive integration or operation.",
      detail: "A valid bakeout defines cleanliness state, temperature limits, pressure, duration or rate criteria, monitoring, witness items and post-bake handling.",
      source: sources.practice
    },
    {
      id: "con-04", category: "Contamination & cleanliness", level: "Working",
      question: "What is the difference between particulate and molecular contamination?",
      answer: "Particulate contamination consists of discrete particles; molecular contamination is deposited film or condensable material. They require different monitoring and control methods.",
      detail: "Particle counts alone do not demonstrate molecular cleanliness, and a witness coupon for film deposition does not replace particulate inspection.",
      source: sources.practice
    },
    {
      id: "con-05", category: "Contamination & cleanliness", level: "Lead",
      question: "Why is cleanroom classification not enough to prove hardware cleanliness?",
      answer: "The room classification describes airborne particle concentration under defined conditions; hardware cleanliness also depends on handling, local operations, materials, purge, tools, packaging and exposure history.",
      detail: "Control the complete contamination path from cleaning through integration, test, storage and transport.",
      source: sources.practice
    },
    {
      id: "con-06", category: "Contamination & cleanliness", level: "Working",
      question: "What is a contamination witness coupon used for?",
      answer: "To collect representative deposition during a process or exposure so contamination can be measured or assessed without relying only on the flight surface.",
      detail: "Placement, exposure time, orientation, handling and analysis method determine whether the coupon is representative.",
      source: sources.practice
    },
    {
      id: "con-07", category: "Contamination & cleanliness", level: "Lead",
      question: "What should happen after an uncontrolled cleanroom exposure?",
      answer: "Protect the item, record duration and conditions, assess contamination risk against sensitive surfaces and requirements, then perform the approved inspection, cleaning or disposition.",
      detail: "Do not assume that visually clean means compliant. Preserve the exposure history for engineering assessment.",
      source: sources.project
    },

    {
      id: "emc-01", category: "EMC interfaces", level: "Working",
      question: "Why must spacecraft EMC test harnesses be configuration controlled?",
      answer: "Harness length, routing, shield termination, bonding, loads and support equipment strongly affect common-mode currents, coupling and measured emissions or susceptibility.",
      detail: "The report should make the tested configuration reproducible and identify justified departures from flight installation.",
      source: sources.emc
    },
    {
      id: "emc-02", category: "EMC interfaces", level: "Lead",
      question: "What is the lead engineer's first response to an EMC failure that disappears after cable movement?",
      answer: "Treat it as configuration-sensitive evidence, freeze and document both states, then investigate routing, termination, bonding and contact repeatability before retest.",
      detail: "Moving the cable until the failure disappears is not corrective action. The sensitivity may expose a real installation risk.",
      source: sources.emc
    },
    {
      id: "emc-03", category: "EMC interfaces", level: "Foundation",
      question: "What is the difference between bonding and grounding?",
      answer: "Bonding establishes a low-impedance electrical connection between conductive items; grounding defines connections to the chosen reference or return structure. The terms overlap in casual speech but solve different interface problems.",
      detail: "At RF, geometry and inductance often dominate resistance. A DC milliohm result alone does not prove a low-impedance RF bond.",
      source: sources.emc
    },
    {
      id: "emc-04", category: "EMC interfaces", level: "Working",
      question: "Why should support equipment be monitored during spacecraft EMC testing?",
      answer: "Support equipment can inject noise, mask emissions, respond to the field instead of the article, or create an unintended current path that changes the test.",
      detail: "Characterise the ambient and support setup, use filtering or isolation where approved, and distinguish article behaviour from facility artefacts.",
      source: sources.emc
    },
    {
      id: "emc-05", category: "EMC interfaces", level: "Lead",
      question: "What does an equipment-level EMC pass not automatically prove?",
      answer: "It does not automatically prove system-level compatibility in the final spacecraft configuration, where interfaces, simultaneous operation, grounding and antenna coupling differ.",
      detail: "Equipment compliance is evidence within a wider system EMC control plan, not the entire compatibility argument.",
      source: sources.emc
    },

    {
      id: "ldr-01", category: "Test leadership", level: "Lead",
      question: "What must a Test Readiness Review establish?",
      answer: "That requirements, article, facility, procedure, configuration, instrumentation, people, safety, software, data handling, constraints and anomaly routes are ready and authorised.",
      detail: "A TRR is a decision gate supported by evidence. Open actions need owners, due dates and an explicit rule for whether they block test.",
      source: sources.project
    },
    {
      id: "ldr-02", category: "Test leadership", level: "Lead",
      question: "What makes a good stop-test criterion?",
      answer: "It is objective, observable, linked to safety or verification risk, assigned to named channels or conditions, and paired with a clear operator action and authority to resume.",
      detail: "Examples include response limits, thermal limits, loss of required monitoring, facility faults, unexpected function or personnel hazards.",
      source: sources.practice
    },
    {
      id: "ldr-03", category: "Test leadership", level: "Lead",
      question: "What is the difference between a deviation and a waiver?",
      answer: "Terminology varies by organisation, but commonly a deviation authorises a departure before the requirement is performed, while a waiver accepts a known nonconformance after it occurs.",
      detail: "Use the project's own definitions and approval route. Both require traceability, technical rationale and impact assessment.",
      source: sources.project
    },
    {
      id: "ldr-04", category: "Test leadership", level: "Lead",
      question: "A schedule owner asks you to continue after an unexplained limit exceedance. What do you do?",
      answer: "Hold the test, protect the hardware and evidence, assess the exceedance through the agreed anomaly process, and resume only with authorised technical disposition.",
      detail: "Schedule pressure does not change the verification requirement or safe operating boundary. State the evidence needed for a defensible decision.",
      source: sources.practice
    },
    {
      id: "ldr-05", category: "Test leadership", level: "Lead",
      question: "What configuration information should be captured in a test record?",
      answer: "Article identity and revision, hardware and software state, interfaces, fasteners, harnesses, support equipment, instrumentation, facility setup, procedures, approved changes and photographs.",
      detail: "The record should let an independent engineer understand what was actually tested, not just what the plan intended.",
      source: sources.project
    },
    {
      id: "ldr-06", category: "Test leadership", level: "Lead",
      question: "How should raw data be treated after a test?",
      answer: "Preserve it read-only with metadata and traceability; create controlled processed products without overwriting the original evidence.",
      detail: "Record software versions, processing settings, filters, units, calibration factors and exclusions so results can be reproduced.",
      source: sources.practice
    },
    {
      id: "ldr-07", category: "Test leadership", level: "Lead",
      question: "What is the strongest response when you do not know a technical answer during a review?",
      answer: "Say what is known, identify the controlled source or specialist needed, state any immediate risk, and close the question with traceable evidence rather than guessing.",
      detail: "Technical leadership is demonstrated by reliable decisions and closure, not by pretending to remember every value.",
      source: sources.practice
    },
    {
      id: "ldr-08", category: "Test leadership", level: "Lead",
      question: "What should a useful test report conclusion contain?",
      answer: "The verification objective, tested configuration, achieved conditions, results against each criterion, anomalies and dispositions, data limitations, deviations and a clear pass/fail or open status.",
      detail: "A stack of plots is evidence input, not a conclusion. Make requirement traceability and engineering judgement explicit.",
      source: sources.project
    },

    {
      id: "ppl-01", category: "People & roles", level: "Names",
      question: "What is Dr. Hamdullah Mohib's publicly listed role?",
      answer: "Acting Chief Executive Officer and Executive Director.",
      detail: "Memory hook: Hamdullah Mohib → acting chief executive plus board-level executive responsibility.",
      source: sources.people
    },
    {
      id: "ppl-02", category: "People & roles", level: "Names",
      question: "Who is publicly listed as Chief Operating Officer?",
      answer: "Raoul d’Hérouville.",
      detail: "Memory hook: Raoul → operations.",
      source: sources.people
    },
    {
      id: "ppl-03", category: "People & roles", level: "Names",
      question: "What is Justin Ledbetter's publicly listed role?",
      answer: "Acting Chief Strategy Officer and Executive Director.",
      detail: "Memory hook: Justin → strategy and executive-director responsibilities.",
      source: sources.people
    },
    {
      id: "ppl-04", category: "People & roles", level: "Names",
      question: "Who is publicly listed as an Executive Director?",
      answer: "Pierre-Damien Vaujour.",
      detail: "Memory hook: Pierre-Damien → executive director.",
      source: sources.people
    },
    {
      id: "ppl-05", category: "People & roles", level: "Names",
      question: "What is Schahan Sediqi's publicly listed role?",
      answer: "General Manager.",
      detail: "Memory hook: Schahan → general management.",
      source: sources.people
    },
    {
      id: "ppl-06", category: "People & roles", level: "Names",
      question: "Who is publicly listed as VP Industrial Operations?",
      answer: "Manny Crespo.",
      detail: "Memory hook: Manny → industrial operations.",
      source: sources.people
    },
    {
      id: "ppl-07", category: "People & roles", level: "Names",
      question: "What is Jamie Denniston's publicly listed role?",
      answer: "VP of Engineering.",
      detail: "Memory hook: Jamie → engineering.",
      source: sources.people
    },
    {
      id: "ppl-08", category: "People & roles", level: "Names",
      question: "Who is publicly listed as VP of Infrastructure?",
      answer: "Rémy Derollez.",
      detail: "Memory hook: Rémy → infrastructure.",
      source: sources.people
    },
    {
      id: "ppl-09", category: "People & roles", level: "Names",
      question: "Which two people are publicly listed as Business Development Directors?",
      answer: "Salim Al Alawi and Ralph Koyess.",
      detail: "Memory hook: Salim and Ralph → business development.",
      source: sources.people
    },
    {
      id: "ppl-10", category: "People & roles", level: "Names",
      question: "What is Mohamed Alkarbi's publicly listed role?",
      answer: "AIT Director.",
      detail: "Memory hook: Mohamed → Assembly, Integration and Test.",
      source: sources.people
    },
    {
      id: "ppl-11", category: "People & roles", level: "Names",
      question: "Who is publicly listed as Finance Director?",
      answer: "Biny Ninan.",
      detail: "Memory hook: Biny → finance.",
      source: sources.people
    },
    {
      id: "ppl-12", category: "People & roles", level: "Names",
      question: "What is Rabia Nasrallah's publicly listed role?",
      answer: "Head of People Ops and Recruiting.",
      detail: "Memory hook: Rabia → people operations and recruitment.",
      source: sources.people
    }
  ];
})();

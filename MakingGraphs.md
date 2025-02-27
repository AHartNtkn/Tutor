# Skill Extraction Procedure

## Introduction: The Dual Nature of Skills

Mastery in any domain requires two complementary types of skills:

1. **Observable Skills**: Concrete, demonstrable actions that transform a specific input to a specific output
2. **Intuitive Skills**: Mental processes that guide selection, application, and adaptation of observable skills

This integrated procedure provides a systematic method for identifying, validating, and organizing both types of skills to create comprehensive learning pathways. While observable skills form the visible foundation of competence, intuitive skills enable the flexible, efficient application of knowledge that characterizes expertise.

## Phase 1: Comprehensive Skill Identification

1. Start with your subject domain (e.g., "Arithmetic" or "Blender")

2. Generate an exhaustive list of skills in two categories:

   ### A. Observable, Demonstrable Skills:
   - Each skill must be something a learner can perform and an observer can evaluate
   - Each skill must have a concrete input state and output state
   - Use specific action verbs: "pan," "orbit," "add," "identify," "select"
   - Avoid abstract concepts: "understand," "know," "grasp," "comprehend"
   - Skills may not be overtly stated in a text, but may be implied by demonstrations

   ### B. Intuitive, Guiding Skills:
   - Skills that guide problem-solving approaches and strategy selection
   - Skills that involve pattern recognition, estimation, or mental modeling
   - Skills that connect different representations or domains
   - Use verbs that capture mental processes: "visualize," "estimate," "predict," "recognize," "connect"
   - These skills may be indirectly observable through problem-solving efficiency, approach selection, or explanation
   - Look for them in expert commentary, efficient shortcuts, or the ability to predict outcomes

3. For each observable skill, apply the "Single Performance Test":
   - Can a learner demonstrate mastery through one specific action?
   - Does the skill transform a clearly defined input to a clearly defined output?
   - If demonstration requires multiple distinct actions, split further

4. For each intuitive skill, apply the "Distinct Insight Test":
   - Does this skill represent a single mental insight or pattern recognition capability?
   - Can this intuition be independently observed through specific behaviors or explanations?
   - If the skill encompasses multiple distinct insights, split it further

## Phase 2: Atomic Skill Verification

For each candidate skill, apply the appropriate set of tests sequentially:

### For Observable Skills:

1. **The Single Operation Test**: Does this skill involve exactly one operation that transforms a specific input to a specific output?
   - Example (Blender): "Pan the 3D viewport" is a single operation
   - Example (Arithmetic): "Identify the numerator in a fraction" is a single operation
   - Counterexample: "Navigate and customize the 3D viewport" contains multiple operations

2. **The Performance Isolation Test**: Can a learner practice this specific skill without simultaneously practicing other skills (except prerequisites)?
   - Example (Blender): You can practice "orbiting the 3D viewport" without practicing "panning" or "zooming"
   - Example (Arithmetic): You can practice "adding fractions with common denominators" without practicing "simplifying fractions"

3. **The Single Step Forward Test**: Does this skill add exactly one new capability beyond its prerequisites?
   - Example (Blender): "Change viewport background color" adds one capability beyond "navigate preferences menu"
   - Example (Arithmetic): "Add fractions with common denominators" adds one capability beyond "identify fraction parts" and "add whole numbers"

4. **The Concrete Demonstration Test**: Can mastery be demonstrated in a single, brief performance with unambiguous success criteria?
   - Example (Blender): "Using the middle mouse button, orbit the viewport to see the cube from the right side"
   - Example (Arithmetic): "Calculate: 2/7 + 3/7 = ?"

### For Intuitive Skills:

1. **The Single Insight Test**: Does this skill involve one specific mental insight or pattern recognition capability?
   - Example (Geometry): "Visualize angle relationships" represents a single insight about how angles relate
   - Example (Programming): "Recognize recursive patterns" is a single type of pattern recognition
   - Counterexample: "Develop mathematical intuition" is too broad and encompasses many distinct insights

2. **The Context Isolation Test**: Can the intuitive skill be practiced in isolation from other intuitive skills, even if it manifests alongside procedural skills?
   - Example (Algebra): You can practice "recognizing factorable expressions" without necessarily "visualizing geometric equivalents"
   - Example (Music): You can practice "hearing harmonic progressions" without "predicting melodic development"

3. **The Single Mental Step Test**: Does this intuition represent one conceptual leap beyond prerequisite intuitions?
   - Example (Calculus): "Visualize local linearity" builds directly on "visualize slopes of curves" with one new insight
   - Example (Chess): "Recognize weak pawn structures" builds on "visualize pawn mobility" with one new pattern

4. **The Manifestation Test**: Can this intuition be reliably observed through specific problem-solving behaviors, approach selections, or explanations?
   - Example (Physics): "Estimation of magnitudes" manifests in ability to quickly judge if calculated answers are reasonable
   - Example (Design): "Visual balance intuition" manifests in consistent placement of elements in balanced compositions

## Phase 3: Concrete Skill Definition

For each validated skill, create a complete definition using the appropriate format:

### For Observable Skills:

1. Create an action-focused ID:
   - Format: `[context]_[action]_[object]`
   - Blender example: `viewport_orbit_scene` not `understanding_viewport_navigation`
   - Arithmetic example: `fraction_identify_numerator` not `understand_numerator_concept`

2. Write an objective with a specific, observable performance:
   - Blender example: "Orbit around objects in the 3D viewport using the middle mouse button"
   - Arithmetic example: "Identify the numerator in a given fraction"

3. Define concrete input and output states:
   - Blender example:
     - Input: "Viewport showing front view of an object"
     - Output: "Viewport showing angled view of the same object after orbiting"
   - Arithmetic example:
     - Input: "A fraction written in standard form (e.g., 3/4)"
     - Output: "Correct identification of the numerator (e.g., 3)"

4. Create unambiguous practice exercises:
   - Blender example: "Starting from the front view, use the middle mouse button to orbit and view the cube from a 45-degree angle"
   - Arithmetic example: "What is the numerator in the fraction 5/9?"

### For Intuitive Skills:

1. Create an insight-focused ID:
   - Format: `[domain]_[intuitive_action]_[object]`
   - Geometry example: `geometry_visualize_angle_relationships` not `understand_angles`
   - Algebra example: `algebra_recognize_factorable_form` not `factoring_intuition`

2. Write an objective with observable indicators of the intuition:
   - Geometry example: "Mentally visualize how angles relate in geometric figures to predict unknown angle measures"
   - Algebra example: "Recognize algebraic expressions that can be factored and identify the appropriate factoring method"

3. Define triggering contexts and resulting insights:
   - Geometry example:
     - Context: "Geometric problems with missing angle values in triangles, quadrilaterals, or parallel lines"
     - Insight: "Mental visualization of angle relationships leading to identification of complementary, supplementary, or transversal angle patterns"
   - Algebra example:
     - Context: "Algebraic expressions that may be factorable"
     - Insight: "Recognition of standard patterns (difference of squares, perfect trinomials, etc.) even in non-standard presentation"

4. Create practice scenarios that develop this intuition:
   - Geometry example: "Without calculating, determine which angles would be equal if these two triangles were similar. Explain your reasoning."
   - Algebra example: "Without performing calculations, identify which of these expressions can be factored as a difference of squares. Explain the pattern you recognized."

## Phase 4: Prerequisite Mapping

For each concrete skill (observable or intuitive):

1. Define explicit, directional prerequisite relationships of three types:
   - Observable prerequisites for observable skills
   - Intuitive prerequisites for intuitive skills
   - Cross-type prerequisites (when an intuitive skill requires an observable skill or vice versa)

   Example:
   ```json
   {
     "id": "fraction_add_unlike_denominators",
     "type": "observable",
     "action": "Add fractions with different denominators",
     "prerequisites": [
       {"id": "fraction_find_common_denominator", "type": "observable"},
       {"id": "fraction_add_common_denominator", "type": "observable"},
       {"id": "fraction_visualize_equivalent_forms", "type": "intuitive"}
     ]
   }
   ```

2. Apply the "One Step Beyond" validation:
   - Each skill should require exactly the listed prerequisites plus one new capability
   - If the gap seems too large, an intermediate skill is missing from your knowledge graph

3. Validate with the "Hierarchical Learning Path" test:
   - For any advanced skill, all paths back to foundational skills should consist of concrete, observable skills and/or well-defined intuitive skills
   - Each step in the path should represent a minimal advancement in capability

## Comprehensive Examples: Blender Navigation Skills

Let's properly decompose Blender navigation into truly atomic skills:

1. Skill: "Identify the 3D viewport"
   - ID: `blender_identify_3d_viewport`
   - Prerequisites: `blender_launch_application`
   - Objective: Locate and identify the main 3D viewport area in the Blender interface
   - Input: Blender default screen layout
   - Output: Correct identification of the 3D viewport region
   - Practice: "Click on the 3D viewport area in the Blender interface"

2. Skill: "Pan the 3D viewport"
   - ID: `viewport_navigation_pan`
   - Prerequisites: `blender_identify_3d_viewport`
   - Objective: Move the viewport view parallel to the view plane
   - Input: Viewport showing part of a scene
   - Output: Viewport showing a different part of the same scene at the same zoom level
   - Practice: "Using Shift + middle mouse button, pan the viewport to center the cube"

3. Skill: "Orbit the 3D viewport"
   - ID: `viewport_navigation_orbit`
   - Prerequisites: `blender_identify_3d_viewport`
   - Objective: Rotate the viewport camera around the scene center point
   - Input: Viewport showing front view of object
   - Output: Viewport showing angled view of same object
   - Practice: "Using the middle mouse button, orbit around the cube to see its right side"

4. Skill: "Zoom the 3D viewport"
   - ID: `viewport_navigation_zoom`
   - Prerequisites: `blender_identify_3d_viewport`
   - Objective: Increase or decrease the viewport magnification
   - Input: Viewport showing scene at current zoom level
   - Output: Viewport showing same scene center point at different zoom level
   - Practice: "Using the scroll wheel, zoom in closer to the cube"

5. Skill: "Access the viewport preferences menu"
   - ID: `viewport_access_preferences_menu`
   - Prerequisites: `blender_identify_3d_viewport`
   - Objective: Open the preferences menu for the 3D viewport
   - Input: Default viewport state
   - Output: Viewport preferences menu open and visible
   - Practice: "Open the viewport preferences menu by clicking on the appropriate icon"

6. Skill: "Select the color picker in preferences menu"
   - ID: `preferences_select_color_picker`
   - Prerequisites: `viewport_access_preferences_menu`
   - Objective: Locate and select the color picker option in the preferences menu
   - Input: Open preferences menu
   - Output: Color picker dialog open
   - Practice: "With the preferences menu open, navigate to and select the background color option"

7. Skill: "Change viewport background color"
   - ID: `viewport_change_background_color`
   - Prerequisites: [`preferences_select_color_picker`]
   - Objective: Select a new color for the viewport background
   - Input: Open color picker dialog
   - Output: Viewport with changed background color
   - Practice: "Using the color picker, change the viewport background to blue"

8. Skill: "Switch between perspective and orthographic views"
   - ID: `viewport_toggle_perspective_mode`
   - Prerequisites: [`viewport_navigation_orbit`, `viewport_access_view_menu`]
   - Objective: Change the viewport from perspective to orthographic mode
   - Input: Viewport in perspective mode
   - Output: Viewport in orthographic mode
   - Practice: "Toggle the viewport from perspective to orthographic mode using the view menu"

## Comprehensive Examples: Arithmetic Skills

Let's properly decompose arithmetic skills into both observable and intuitive components:

### Observable Skills:

1. Skill: "Count objects up to 5"
   - ID: `counting_count_objects_to_5`
   - Prerequisites: None (foundational skill)
   - Objective: Count the number of objects in a group containing 1-5 items
   - Input: Visual group of 1-5 objects
   - Output: Correct count stated numerically
   - Practice: "How many stars are in this image: ⭐⭐⭐?"

2. Skill: "Compare two single-digit numbers"
   - ID: `number_compare_single_digit`
   - Prerequisites: [`number_identify_single_digit`]
   - Objective: Determine which of two single-digit numbers is greater
   - Input: Two single-digit numbers
   - Output: Correct identification of the greater number
   - Practice: "Which is greater: 4 or 7?"

4. Skill: "Identify the numerator in a fraction"
   - ID: `fraction_identify_numerator`
   - Prerequisites: [`number_identify_single_digit`]
   - Objective: Given a fraction, identify the number above the fraction line
   - Input: A fraction written in standard form (e.g., 3/4)
   - Output: Correct identification of the numerator (e.g., 3)
   - Practice: "What is the numerator in the fraction 7/8?"

5. Skill: "Identify the denominator in a fraction"
   - ID: `fraction_identify_denominator`
   - Prerequisites: [`number_identify_single_digit`]
   - Objective: Given a fraction, identify the number below the fraction line
   - Input: A fraction written in standard form (e.g., 3/4)
   - Output: Correct identification of the denominator (e.g., 4)
   - Practice: "What is the denominator in the fraction 7/8?"

6. Skill: "Add single-digit numbers with sum less than 10"
   - ID: `addition_add_single_digit_under_10`
   - Prerequisites: [`number_identify_single_digit`, `counting_count_objects_to_10`]
   - Objective: Calculate the sum of two single-digit numbers when the sum is less than 10
   - Input: Two single-digit numbers (e.g., 3 and 4)
   - Output: Their correct sum (e.g., 7)
   - Practice: "Calculate: 3 + 4 = ?"

7. Skill: "Add fractions with common denominators"
   - ID: `fraction_add_common_denominator`
   - Prerequisites: [`fraction_identify_numerator`, `fraction_identify_denominator`, `addition_add_single_digit`]
   - Objective: Given two fractions with the same denominator, find their sum
   - Input: Two fractions with common denominators (e.g., 1/5 and 2/5)
   - Output: Their correct sum as a fraction (e.g., 3/5)
   - Practice: "Calculate: 2/7 + 3/7 = ?"

### Intuitive Skills:

1. Skill: "Recognize quantity without counting"
   - ID: `counting_subitize_small_groups`
   - Prerequisites: None (foundational intuitive skill)
   - Objective: Instantly recognize the quantity of a small group (1-5) objects without counting
   - Context: Brief exposure to a small collection of objects
   - Insight: Immediate recognition of "threeness" or "fourness" without sequential counting
   - Practice: "Flash cards showing 1-5 objects for only 2 seconds each"

2. Skill: "Visualize number magnitude relationships"
   - ID: `number_visualize_relative_magnitude`
   - Prerequisites: [`number_identify_single_digit`]
   - Objective: Mentally visualize numbers as positions on a number line to compare magnitudes
   - Context: Comparing two numbers or estimating calculation results
   - Insight: Mental image of relative positions and distances on a number line
   - Practice: "Without calculating, is 18 + 27 closer to 40 or 50? Explain your reasoning."

3. Skill: "Visualize fraction as part-whole relationships"
   - ID: `fraction_visualize_part_whole`
   - Prerequisites: [`fraction_identify_numerator`, `fraction_identify_denominator`]
   - Objective: Mentally visualize fractions as parts of a whole to understand relationships
   - Context: Comparing or operating on fractions
   - Insight: Mental image of fractional parts and their relative sizes
   - Practice: "Without calculating, arrange these fractions in ascending order: 3/8, 5/12, 1/3. Explain your reasoning."

## Comprehensive Examples: Blender Skills

Let's decompose Blender skills into both observable and intuitive components:

### Observable Skills:

1. Skill: "Identify the 3D viewport"
   - ID: `blender_identify_3d_viewport`
   - Prerequisites: `blender_launch_application`
   - Objective: Locate and identify the main 3D viewport area in the Blender interface
   - Input: Blender default screen layout
   - Output: Correct identification of the 3D viewport region
   - Practice: "Click on the 3D viewport area in the Blender interface"

2. Skill: "Pan the 3D viewport"
   - ID: `viewport_navigation_pan`
   - Prerequisites: `blender_identify_3d_viewport`
   - Objective: Move the viewport view parallel to the view plane
   - Input: Viewport showing part of a scene
   - Output: Viewport showing a different part of the same scene at the same zoom level
   - Practice: "Using Shift + middle mouse button, pan the viewport to center the cube"

### Intuitive Skills:

1. Skill: "Visualize 3D space from 2D representation"
   - ID: `viewport_visualize_3d_space`
   - Prerequisites: `blender_identify_3d_viewport`
   - Objective: Mentally visualize the three-dimensional space represented in the 2D viewport
   - Context: Looking at objects in the Blender viewport
   - Insight: Mental construction of the 3D space including dimensions, depths, and spatial relationships not directly visible
   - Practice: "Looking at this viewport, describe what you would see if you orbited 90 degrees to the right"

2. Skill: "Predict effect of transformation tools"
   - ID: `transform_predict_operation_result`
   - Prerequisites: [`viewport_visualize_3d_space`, `transform_identify_tools`]
   - Objective: Mentally predict how using a transformation tool will affect a selected object
   - Context: Preparing to transform an object in the 3D viewport
   - Insight: Mental preview of the transformation's result before performing it
   - Practice: "Without performing the action, describe how the cube would look after scaling it along the Z-axis only"

## Visual Decision Flow Chart for Integrated Skill Extraction

```
Start with potential skill
       |
       v
Is this primarily an observable skill or an intuitive skill?
       |
     /   \
Observable   Intuitive
    |           |
    v           v
Is this skill demonstrable    Does this skill represent a
through a single,            distinct mental insight or
specific action?             pattern recognition?
    |                          |
  /   \                      /   \
No     Yes                 No     Yes
 |      |                   |      |
 v      v                   v      v
Split   Does the skill      Split   Does the insight manifest
further transform a specific further in observable behaviors
        input to output?            or explanations?
          |                           |
        /   \                       /   \
      No     Yes                  No     Yes
       |      |                    |      |
       v      v                    v      v
    Split    Can this be         Split    Can this intuition be
   further   practiced in        further  practiced separately from
            isolation?                    other intuitions?
              |                             |
            /   \                         /   \
          No     Yes                    No     Yes
           |      |                      |      |
           v      v                      v      v
        Split    Does this add         Split    Does this represent one
       further   exactly one new      further   conceptual leap beyond
                capability?                     prerequisites?
                  |                               |
                /   \                           /   \
              No     Yes                      No     Yes
               |      |                        |      |
               v      v                        v      v
            Split    Congratulations!       Split    Congratulations!
           further   You have an           further   You have an atomic
                    atomic observable               intuitive skill.
                    skill.
```

## Key Insight: The "One-Capability Jump" Rule for Both Skill Types

The fundamental principle of creating truly atomic skills—whether observable or intuitive—is the "One-Capability Jump" rule:

1. Each skill should represent exactly one incremental capability beyond its prerequisites
2. A learner who has mastered all prerequisites should only need to learn one new thing to master this skill
3. The skill should be independently practicable once prerequisites are mastered
4. A successful demonstration of the skill should have unambiguous success criteria

For observable skills, this means one concrete operation producing a specific output.
For intuitive skills, this means one mental insight that manifests in predictable problem-solving behaviors.

By ruthlessly applying this principle to every skill in your knowledge graph, you'll achieve the precise level of granularity needed for effective mastery learning of both the visible actions and invisible thinking processes that constitute expertise.

## Guidelines Specific to Intuitive Skills

When extracting intuitive skills, keep these additional considerations in mind:

1. **Manifestation Criteria**: Always define how an intuitive skill manifests in observable behavior. This might be through:
   - Approach selection (choosing an efficient technique)
   - Problem-solving speed (bypassing lengthy calculations)
   - Explanation quality (articulating patterns or relationships)
   - Error detection (quickly identifying implausible results)
   - Transfer capacity (applying knowledge in novel contexts)

2. **Development Progressions**: Structure intuitive skill progressions from:
   - Concrete to abstract representations
   - Simple to complex patterns
   - Guided to independent application
   - Specific to general contexts
   - Explicit to implicit use

3. **Assessment Approaches**: Design assessments that capture intuitive skills through:
   - Prediction tasks (what will happen if...)
   - Justification questions (explain why you chose...)
   - Comparison scenarios (which approach is more efficient...)
   - Time-constrained problems (requiring intuitive shortcuts)
   - Transfer challenges (applying patterns in new domains)

4. **Integration with Observable Skills**: Map how intuitive skills support observable skills:
   - Which intuitions guide which procedures?
   - When should an intuition be developed before a procedure?
   - When does procedural practice build intuition?
   - How do they reinforce each other?

By systematically addressing both observable and intuitive skills, this integrated extraction procedure creates a complete map of the capabilities that constitute true mastery in any domain.
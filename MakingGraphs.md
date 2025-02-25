# Core Idea Extraction Procedure

## Phase 1: Observable Skill Identification

1. Start with your subject domain (e.g., "Arithmetic" or "Blender")

2. Generate an exhaustive list of **observable, demonstrable skills**:
   - Each skill must be something a learner can perform and an observer can evaluate
   - Each skill must have a concrete input state and output state
   - Use specific action verbs: "pan," "orbit," "add," "identify," "select"
   - Avoid abstract concepts: "understand," "know," "grasp," "comprehend"

3. For each skill, apply the "Single Performance Test":
   - Can a learner demonstrate mastery through one specific action?
   - Does the skill transform a clearly defined input to a clearly defined output?
   - If demonstration requires multiple distinct actions, split further

## Phase 2: Atomic Skill Verification

For each candidate core idea, apply these tests sequentially:

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

## Phase 3: Concrete Skill Definition

For each validated core idea:

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

## Phase 4: Prerequisite Mapping

For each concrete skill:

1. Define explicit, directional prerequisite relationships:
   ```json
   {
     "id": "viewport_change_background_color",
     "action": "Change the background color of the 3D viewport",
     "prerequisites": ["navigate_preferences_menu", "use_color_picker"]
   }
   ```

2. Apply the "One Step Beyond" validation:
   - Each skill should require exactly the listed prerequisites plus one new capability
   - If the gap seems too large, an intermediate skill is missing from your knowledge graph

3. Validate with the "Hierarchical Learning Path" test:
   - For any advanced skill, all paths back to foundational skills should consist of concrete, observable skills
   - Each step in the path should represent a minimal advancement in capability

## Comprehensive Examples: Blender Navigation Skills

Let's properly decompose Blender navigation into truly atomic skills:

1. Core Idea: "Identify the 3D viewport"
   - ID: `blender_identify_3d_viewport`
   - Prerequisites: `blender_launch_application`
   - Objective: Locate and identify the main 3D viewport area in the Blender interface
   - Input: Blender default screen layout
   - Output: Correct identification of the 3D viewport region
   - Practice: "Click on the 3D viewport area in the Blender interface"

2. Core Idea: "Pan the 3D viewport"
   - ID: `viewport_navigation_pan`
   - Prerequisites: `blender_identify_3d_viewport`
   - Objective: Move the viewport view parallel to the view plane
   - Input: Viewport showing part of a scene
   - Output: Viewport showing a different part of the same scene at the same zoom level
   - Practice: "Using Shift + middle mouse button, pan the viewport to center the cube"

3. Core Idea: "Orbit the 3D viewport"
   - ID: `viewport_navigation_orbit`
   - Prerequisites: `blender_identify_3d_viewport`
   - Objective: Rotate the viewport camera around the scene center point
   - Input: Viewport showing front view of object
   - Output: Viewport showing angled view of same object
   - Practice: "Using the middle mouse button, orbit around the cube to see its right side"

4. Core Idea: "Zoom the 3D viewport"
   - ID: `viewport_navigation_zoom`
   - Prerequisites: `blender_identify_3d_viewport`
   - Objective: Increase or decrease the viewport magnification
   - Input: Viewport showing scene at current zoom level
   - Output: Viewport showing same scene center point at different zoom level
   - Practice: "Using the scroll wheel, zoom in closer to the cube"

5. Core Idea: "Access the viewport preferences menu"
   - ID: `viewport_access_preferences_menu`
   - Prerequisites: `blender_identify_3d_viewport`
   - Objective: Open the preferences menu for the 3D viewport
   - Input: Default viewport state
   - Output: Viewport preferences menu open and visible
   - Practice: "Open the viewport preferences menu by clicking on the appropriate icon"

6. Core Idea: "Select the color picker in preferences menu"
   - ID: `preferences_select_color_picker`
   - Prerequisites: `viewport_access_preferences_menu`
   - Objective: Locate and select the color picker option in the preferences menu
   - Input: Open preferences menu
   - Output: Color picker dialog open
   - Practice: "With the preferences menu open, navigate to and select the background color option"

7. Core Idea: "Change viewport background color"
   - ID: `viewport_change_background_color`
   - Prerequisites: [`preferences_select_color_picker`]
   - Objective: Select a new color for the viewport background
   - Input: Open color picker dialog
   - Output: Viewport with changed background color
   - Practice: "Using the color picker, change the viewport background to blue"

8. Core Idea: "Switch between perspective and orthographic views"
   - ID: `viewport_toggle_perspective_mode`
   - Prerequisites: [`viewport_navigation_orbit`, `viewport_access_view_menu`]
   - Objective: Change the viewport from perspective to orthographic mode
   - Input: Viewport in perspective mode
   - Output: Viewport in orthographic mode
   - Practice: "Toggle the viewport from perspective to orthographic mode using the view menu"

## Comprehensive Examples: Arithmetic Skills

Let's decompose arithmetic skills with the same level of granularity:

1. Core Idea: "Count objects up to 5"
   - ID: `counting_count_objects_to_5`
   - Prerequisites: None (foundational skill)
   - Objective: Count the number of objects in a group containing 1-5 items
   - Input: Visual group of 1-5 objects
   - Output: Correct count stated numerically
   - Practice: "How many stars are in this image: ⭐⭐⭐?"

2. Core Idea: "Identify single-digit numerals"
   - ID: `number_identify_single_digit`
   - Prerequisites: None (foundational skill)
   - Objective: Recognize and name the numerals 0-9
   - Input: Visual presentation of a single-digit numeral
   - Output: Correct name of the numeral
   - Practice: "What number is this: 7?"

3. Core Idea: "Compare two single-digit numbers"
   - ID: `number_compare_single_digit`
   - Prerequisites: [`number_identify_single_digit`]
   - Objective: Determine which of two single-digit numbers is greater
   - Input: Two single-digit numbers
   - Output: Correct identification of the greater number
   - Practice: "Which is greater: 4 or 7?"

4. Core Idea: "Identify the numerator in a fraction"
   - ID: `fraction_identify_numerator`
   - Prerequisites: [`number_identify_single_digit`]
   - Objective: Given a fraction, identify the number above the fraction line
   - Input: A fraction written in standard form (e.g., 3/4)
   - Output: Correct identification of the numerator (e.g., 3)
   - Practice: "What is the numerator in the fraction 7/8?"

5. Core Idea: "Identify the denominator in a fraction"
   - ID: `fraction_identify_denominator`
   - Prerequisites: [`number_identify_single_digit`]
   - Objective: Given a fraction, identify the number below the fraction line
   - Input: A fraction written in standard form (e.g., 3/4)
   - Output: Correct identification of the denominator (e.g., 4)
   - Practice: "What is the denominator in the fraction 7/8?"

6. Core Idea: "Add single-digit numbers with sum less than 10"
   - ID: `addition_add_single_digit_under_10`
   - Prerequisites: [`number_identify_single_digit`, `counting_count_objects_to_10`]
   - Objective: Calculate the sum of two single-digit numbers when the sum is less than 10
   - Input: Two single-digit numbers (e.g., 3 and 4)
   - Output: Their correct sum (e.g., 7)
   - Practice: "Calculate: 3 + 4 = ?"

7. Core Idea: "Add fractions with common denominators"
   - ID: `fraction_add_common_denominator`
   - Prerequisites: [`fraction_identify_numerator`, `fraction_identify_denominator`, `addition_add_single_digit`]
   - Objective: Given two fractions with the same denominator, find their sum
   - Input: Two fractions with common denominators (e.g., 1/5 and 2/5)
   - Output: Their correct sum as a fraction (e.g., 3/5)
   - Practice: "Calculate: 2/7 + 3/7 = ?"

## Visual Decision Flow Chart for Core Idea Extraction

To help in the practical application of this approach, here's a flowchart for determining if a skill is truly atomic:

```
Start with potential skill
       |
       v
Is this skill demonstrable through a single, specific action?
       |
     /   \
   No     Yes
    |      |
    v      v
Split    Does the skill transform a specific input to a specific output?
further   |
        /   \
      No     Yes
       |      |
       v      v
    Split     Can this skill be practiced in isolation from other skills?
   further    |
            /   \
          No     Yes
           |      |
           v      v
        Split     Does this skill add exactly one capability beyond prerequisites?
       further    |
                /   \
              No     Yes
               |      |
               v      v
            Split     Congratulations! You have an atomic core idea.
           further
```

## Key Insight: The "One-Capability Jump"

The fundamental principle of creating truly atomic skills is the "One-Capability Jump" rule:

1. Each skill should represent exactly one incremental capability beyond its prerequisites
2. A learner who has mastered all prerequisites should only need to learn one new thing to master this skill
3. The skill should be independently practicable once prerequisites are mastered
4. A successful demonstration of the skill should have unambiguous success criteria

By ruthlessly applying this principle to every skill in your knowledge graph, you'll achieve the precise level of granularity needed for effective mastery learning.

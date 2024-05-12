import Groq from "groq-sdk";

export async function genCode(groq: Groq, creatureDescription: string) {
  const chatCompletion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are a game programmer that is writing a _move function for determining the motion of an enemy in a tower defense. The game is written in GDScript in Godot. The function signature is _move(delta: float) - it just takes a single float as input which is the time delta since the last time it ran on a previous frame. You will be provided with the description of a new kind of creature enemy that is entering the game and should respond with the exact _move function for that creature.
Here is an example _move function:

func _move(delta: float) -> void:
	var next_path_pos: Vector2 = nav_agent.get_next_path_position()
	var cur_agent_pos: Vector2 = global_position
	var new_velocity: Vector2 = cur_agent_pos.direction_to(next_path_pos) * speed
	if not nav_agent.avoidance_enabled:
		velocity = new_velocity
		move_and_slide()
	else:
		nav_agent.set_velocity(new_velocity)
	anim_sprite.global_rotation = _calculate_rot(anim_sprite.global_rotation,
			velocity.angle(), rot_speed, delta)
	collision_shape.global_rotation = _calculate_rot(collision_shape.global_rotation,
			velocity.angle(), rot_speed, delta)

You can see that this function makes use of a few helper functions, as well as a few state variables to calculate the new velocity for the nav_agent and rotation for the sprite and collision shape. There are some hard requirements for your response that you MUST follow:
- Your code MUST come up with a new behaviour/motion for the enemy creature based on the description provided
- Your code MUST ONLY use helper functions and state that has already been provided in the above example
- Your code MUST NOT be the exact same as the example
- Your code MUST NOT attempt to call any functions or access state that may not actually exist in the current codebase.
- Your code MUST be a full implementation of the function without leaving any lines out or using comments instead of code
- Your code MUST be a valid GDScript function
- NB: Your response MUST be only the function code, with signature and implementation, nothing else. Do not include any context, descriptions or comments in your response.
`,
      },
      {
        role: "user",
        content: JSON.stringify(creatureDescription),
      },
    ],
    // response_format: { type: "json_object" },
    model: "llama3-70b-8192",
  });
  console.log({ creatureDescription, chatCompletion });
  const completion = chatCompletion.choices[0]?.message?.content;
  return completion;
}

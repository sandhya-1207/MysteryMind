def create_mystery_prompt(theme, difficulty, puzzle_count):
    return f"""
You are an expert escape-room game designer.

Create an interactive mystery game.

Theme: {theme}
Difficulty: {difficulty}
Number of puzzles: {puzzle_count}

Requirements:
- Create exactly {puzzle_count} puzzles.
- Make the story interesting and logical.
- Each puzzle must have one clear answer.
- Puzzles should become progressively harder.
- Do not reveal the answers in the puzzle descriptions.
- Keep the content suitable for general audiences.
- Return ONLY valid JSON.

Use this exact JSON structure:

{{
    "title": "Mystery title",
    "story": "Short mystery story",
    "puzzles": [
        {{
            "id": 1,
            "question": "Puzzle question",
            "answer": "Correct answer",
            "hint": "Helpful hint"
        }}
    ]
}}
"""
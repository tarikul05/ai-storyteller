import requests
import json

class StoryTellerCLI:
    def __init__(self, base_url="http://localhost:8000"):
        self.base_url = base_url
    
    def create_story_interactive(self):
        print("🧚‍♀️ Welcome to Magic Storyteller! 🧚‍♀️")
        print("Let's create a magical story together!\n")
        
        child_name = input("Child's name: ")
        age = int(input("Child's age (3-12): "))
        main_character = input("Main character (e.g., 'Brave Dragon', 'Curious Fox'): ")
        theme = input("Theme (courage/friendship/teamwork/kindness/adventure): ")
        setting = input("Story setting (e.g., 'Magical Forest', 'Space Station'): ")
        
        story_request = {
            "child_name": child_name,
            "age": age,
            "theme": theme,
            "main_character": main_character,
            "setting": setting,
            "include_images": True,
            "include_audio": True
        }
        
        print("\n✨ Creating your magical story...")
        
        try:
            response = requests.post(
                f"{self.base_url}/generate-story",
                json=story_request
            )
            
            if response.status_code == 200:
                story = response.json()
                self.display_story(story)
            else:
                print("❌ Failed to generate story")
                
        except Exception as e:
            print(f"❌ Error: {e}")
    
    def display_story(self, story):
        print(f"\n{'='*50}")
        print(f"📖 {story['title']}")
        print(f"{'='*50}")
        print(f"\n{story['content']}")
        print(f"\n💫 Moral: {story['moral']}")
        print(f"\n🎵 Audio available at: {story['audio_path']}")
        print(f"🖼️ {len(story['images'])} magical scenes generated!")

if __name__ == "__main__":
    cli = StoryTellerCLI()
    cli.create_story_interactive()
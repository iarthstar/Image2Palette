import UI from 'sketch/ui'
import Settings from 'sketch/settings'

export default function setAuthStr() {
    UI.getInputFromUser(
        "Please paste the Authorization String here",
        {
            description: "If you dont have one then do as following : \n1. Open Imagga.com \n2. Sign In / Sign Up and go to Dashboard \n3. Copy the Authorization String\n",
            initialValue: '',
        },
        (err, value) => {
            if (err) {
                // most likely the user canceled the input
                return
            }
            Settings.setSettingForKey("api-key", value);
        }
    );
}
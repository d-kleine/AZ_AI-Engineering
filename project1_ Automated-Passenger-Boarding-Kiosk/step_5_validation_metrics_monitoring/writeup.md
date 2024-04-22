# Reflection on Azure Cognitive Resource-Specific Problems

During the project, two significant challenges were encountered: timeout issues with the Azure Computer Vision API and object detection challenges with Azure Custom Vision.

**Timeout Issues with Azure Computer Vision API:**
- Occasional timeouts during facial recognition tasks.
- Resolved by optimizing image/video sizes, implementing batch processing, and adding a retry mechanism.

**Object Detection Challenges with Azure Custom Vision:**
- Limited training images affected model performance in object detection of lighters
- Can be addressed by increasing training data or data augmentation

Despite these challenges, implementing these strategies significantly improved the performance of the AI components in the automated passenger boarding kiosk application.
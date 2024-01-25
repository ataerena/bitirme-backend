from ultralytics import YOLO

if __name__ == '__main__':
    model = YOLO("yolov8n.pt")  # choose a lower data model for faster calculation (takes around 4ms on yolov8n)
    results = model("./temp_image.jpg")  # image to predict on comes from backend

    max_conf = 0
    element = 'element'
    
    if len(results) != 0:
        for result in results: # loop over each image and in each image loop over each detection box object
            for box in result.boxes:
                conf = box.conf.item()

                if conf > max_conf:
                    max_conf = conf
                    element = box # return element with highest confidence rate
        if hasattr(element, 'cls'):
            label = results[0].names[element.cls.item()] # get label name of the highest confidence rated element
        else:
            label = ""
    
    with open('result.txt', 'w') as file:
        file.write(label)
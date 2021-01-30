import paho.mqtt.client as mqtt


def on_connect(client, userdata, flags, rc):
    print("Connected with result code "+str(rc))

    # Subscribing in on_connect() means that if we lose the connection and
    # reconnect then subscriptions will be renewed.
    client.subscribe("/chat/general")

# The callback for when a PUBLISH message is received from the server.


def on_message(client, userdata, msg):
    print(msg.topic+" "+str(msg.payload))
    print(str(msg.payload).split("'")[1])


client = mqtt.Client()
client.on_connect = on_connect
client.on_message = on_message

client.connect("10.45.3.171", 1883, 60)
run = True
while run:
    # client.loop_forever()
    print("What's next")
    x = input()
    if x == "3":
        run = False

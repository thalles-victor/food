package main

import (
	"fmt"
	"os"
	"os/signal"

	"github.com/IBM/sarama"
)

func main() {
	// Configuração do consumidor
	config := sarama.NewConfig()
	config.Consumer.Return.Errors = true
	config.Consumer.Offsets.Initial = sarama.OffsetNewest // Começar a partir das mensagens novas

	// Lista de brokers
	brokers := []string{"localhost:9092"}

	// Lista de tópicos que você quer consumir
	topics := []string{"test_topic", "payment-confirmation-topic"}

	// Criar consumidor de grupo ou consumidor simples
	consumer, err := sarama.NewConsumer(brokers, config)
	if err != nil {
		fmt.Printf("Erro ao criar consumidor: %v\n", err)
		return
	}
	defer consumer.Close()

	// Canal para sinais de interrupção
	signals := make(chan os.Signal, 1)
	signal.Notify(signals, os.Interrupt)

	// Criar um canal para receber mensagens
	msgChan := make(chan *sarama.ConsumerMessage)
	errChan := make(chan *sarama.ConsumerError)

	// Consumir cada tópico
	for _, topic := range topics {
		partitions, err := consumer.Partitions(topic)
		if err != nil {
			fmt.Printf("Erro ao obter partições para o tópico %s: %v\n", topic, err)
			continue
		}

		// Consumir todas as partições de cada tópico
		for _, partition := range partitions {
			partitionConsumer, err := consumer.ConsumePartition(topic, partition, sarama.OffsetNewest)
			if err != nil {
				fmt.Printf("Erro ao consumir partição %d do tópico %s: %v\n", partition, topic, err)
				continue
			}

			// Goroutine para processar mensagens de cada partição
			go func(pc sarama.PartitionConsumer) {
				defer pc.Close()
				for {
					select {
					case msg := <-pc.Messages():
						msgChan <- msg
					case err := <-pc.Errors():
						errChan <- err
					case <-signals:
						return
					}
				}
			}(partitionConsumer)
		}
	}

	// Processar mensagens e erros
	for {
		select {
		case msg := <-msgChan:
			if msg.Topic == "payment-confirmation-topic" {
				fmt.Printf("=== Confirmação de Pagamento ===\nTópico: %s\nPartição: %d\nDados: %s\n====================\n",
					msg.Topic, msg.Partition, string(msg.Value))
			} else {
				fmt.Printf("Tópico: %s, Partição: %d, Mensagem: %s\n",
					msg.Topic, msg.Partition, string(msg.Value))
			}
		case err := <-errChan:
			fmt.Printf("Erro no consumidor: %v\n", err)
		case <-signals:
			fmt.Println("Encerrando consumidor...")
			return
		}
	}
}

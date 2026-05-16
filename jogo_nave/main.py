import pygame
import sys
from settings import *
from entities import Player, Asteroid, Bullet

def main():
    # Inicialização do Pygame
    pygame.init()
    pygame.font.init()
    
    # Configuração da Janela
    screen = pygame.display.set_mode((WIDTH, HEIGHT))
    pygame.display.set_caption("Jogo de Nave e Asteroides")
    
    clock = pygame.time.Clock()
    font = pygame.font.SysFont('Arial', 30)
    
    # Grupos para gerenciar múltiplos sprites de forma eficiente
    all_sprites = pygame.sprite.Group()
    asteroids = pygame.sprite.Group()
    bullets = pygame.sprite.Group()
    
    # Instancia o jogador
    player = Player()
    all_sprites.add(player)
    
    # Evento customizado de "Spawn" de asteroide a cada N milissegundos
    SPAWNASTEROID = pygame.USEREVENT + 1
    pygame.time.set_timer(SPAWNASTEROID, ASTEROID_SPAWN_RATE)
    
    score = 0
    running = True
    game_over = False

    while running:
        # Garante que o jogo rode no máximo a FPS quadros por segundo
        clock.tick(FPS)
        
        # 1. Processamento de Eventos (Teclado, Mouse, Fechar janela)
        for event in pygame.event.get():
            if event.type == pygame.QUIT:
                running = False
            
            if not game_over:
                # Evento periódico para criar novos asteroides
                if event.type == SPAWNASTEROID:
                    asteroid = Asteroid()
                    all_sprites.add(asteroid)
                    asteroids.add(asteroid)
                
                # Eventos de clique em botões do teclado
                if event.type == pygame.KEYDOWN:
                    if event.key == pygame.K_SPACE:
                        player.shoot(all_sprites, bullets)

        if not game_over:
            # 2. Atualiza a lógica de posição de todos os elementos
            all_sprites.update()
            
            # 3. Tratamento de Colisões
            
            # Verifica colisão entre tiros e asteroides. 
            # Os parâmetros 'True, True' significam que ambos somem na colisão.
            hits = pygame.sprite.groupcollide(asteroids, bullets, True, True)
            for hit in hits:
                score += 10 # Ganha 10 pontos ao destruir asteroide
            
            # Verifica colisão do jogador com algum asteroide
            if pygame.sprite.spritecollide(player, asteroids, False):
                game_over = True
            
            # Verifica se algum asteroide passou da parte de baixo da tela
            for asteroid in asteroids:
                if asteroid.rect.top > HEIGHT:
                    game_over = True

        # 4. Desenha tudo na tela
        screen.fill(BLACK) # Limpa o frame anterior pintando tudo de preto
        
        if not game_over:
            all_sprites.draw(screen)
            # Desenha texto da pontuação
            score_text = font.render(f"Pontuação: {score}", True, WHITE)
            screen.blit(score_text, (10, 10))
        else:
            # Texto da tela de "Game Over"
            game_over_text = font.render("GAME OVER", True, RED)
            score_text = font.render(f"Pontuação Final: {score}", True, WHITE)
            restart_text = font.render("Feche a janela para sair", True, WHITE)
            
            # Centraliza o texto
            screen.blit(game_over_text, (WIDTH//2 - game_over_text.get_width()//2, HEIGHT//2 - 50))
            screen.blit(score_text, (WIDTH//2 - score_text.get_width()//2, HEIGHT//2))
            screen.blit(restart_text, (WIDTH//2 - restart_text.get_width()//2, HEIGHT//2 + 50))
        
        # 5. Flip mostra as alterações na janela visível
        pygame.display.flip()

    pygame.quit()
    sys.exit()

if __name__ == "__main__":
    main()

import pygame
import random
from settings import *

class Player(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        self.image = pygame.Surface((PLAYER_WIDTH, PLAYER_HEIGHT))
        self.image.fill(GREEN) # O jogador será um retângulo verde
        self.rect = self.image.get_rect()
        self.rect.centerx = WIDTH // 2
        self.rect.bottom = HEIGHT - 20
        self.speed_x = 0

    def update(self):
        self.speed_x = 0
        keys = pygame.key.get_pressed()
        
        # Movimentação pelas setas do teclado
        if keys[pygame.K_LEFT]:
            self.speed_x = -PLAYER_SPEED
        if keys[pygame.K_RIGHT]:
            self.speed_x = PLAYER_SPEED
        
        self.rect.x += self.speed_x
        
        # Não permite que a nave saia da tela
        if self.rect.right > WIDTH:
            self.rect.right = WIDTH
        if self.rect.left < 0:
            self.rect.left = 0

    def shoot(self, all_sprites, bullets):
        # Cria um tiro saindo do centro da nave
        bullet = Bullet(self.rect.centerx, self.rect.top)
        all_sprites.add(bullet)
        bullets.add(bullet)

class Asteroid(pygame.sprite.Sprite):
    def __init__(self):
        super().__init__()
        size = random.randint(ASTEROID_MIN_SIZE, ASTEROID_MAX_SIZE)
        self.image = pygame.Surface((size, size))
        self.image.fill(RED) # Asteroides vermelhos
        self.rect = self.image.get_rect()
        
        # Surgem aleatoriamente no topo da tela
        self.rect.x = random.randint(0, WIDTH - size)
        self.rect.y = random.randint(-100, -40)
        self.speed_y = random.randint(ASTEROID_SPEED_MIN, ASTEROID_SPEED_MAX)

    def update(self):
        # Descida constante
        self.rect.y += self.speed_y

class Bullet(pygame.sprite.Sprite):
    def __init__(self, x, y):
        super().__init__()
        self.image = pygame.Surface((BULLET_WIDTH, BULLET_HEIGHT))
        self.image.fill(YELLOW) # Tiros amarelos
        self.rect = self.image.get_rect()
        self.rect.bottom = y
        self.rect.centerx = x

    def update(self):
        # Sobem na tela
        self.rect.y -= BULLET_SPEED
        # Se sair da tela, deletamos o tiro para liberar memória
        if self.rect.bottom < 0:
            self.kill()

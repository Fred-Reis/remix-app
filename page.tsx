"use client";

import { ProductCard } from "./components/ProductCard";
import { Header } from "./components/Header";
import { HeadingBanner } from "./components/HeadingBanner";
import { PromoBanner } from "./components/PromoBanner";

import product from "./utils/mock_product.json";
import { useEffect, useState } from "react";

const TIME_LEFT = 180;
const DISCOUNT = 50;

export default function Home() {
  const [timeLeft, setTimeLeft] = useState(TIME_LEFT);

  useEffect(() => {
    if (timeLeft === 0) return;

    const intervalId = setInterval(() => {
      setTimeLeft((timeLeft) => timeLeft - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timeLeft]);

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <HeadingBanner
        title="Black Friday only!"
        body="Don't miss out! The perfect complement to the Dark Roast Duo"
      />
      <section className="flex flex-col max-w-[938px] items-center justify-center m-auto">
        <PromoBanner counter={timeLeft} />
        <ProductCard
          product={product}
          discount={timeLeft > 0 ? DISCOUNT : null}
        />
      </section>
      <footer className="row-start-3 flex gap-6 flex-wrap items-center justify-center"></footer>
    </main>
  );
}

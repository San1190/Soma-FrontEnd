import React, { useMemo, useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Circle, Line, G, Text as SvgText } from 'react-native-svg';

const SmartClock = (props) => {
  const {
    size = 260,
    theme = {
      bg: '#F6FAF2',        // fondo del círculo
      ring: '#b8d7a2',      // aro exterior verde suave
      ticks: '#b8d7a2',     // marcas
      hands: '#243447',     // color agujas
      hub: '#243447',       // punto central
    },
    showNumbers = true,
    tickMs = 1000,            //frecuencia de actualización en ms
    style,
  } = props;

  // Estado con la hora actual
  const [now, setNow] = useState(new Date());

  // Intervalo para actualizar cada segundo (o tickMs)
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), tickMs);
    return () => clearInterval(id);
  }, [tickMs]);

  const hours = now.getHours();
  const minutes = now.getMinutes();
  const seconds = now.getSeconds();

  const r = size / 2;             
  const center = { x: r, y: r };  

  // Conversión a ángulos (radianes). 0 arriba, horario +
  const { hourAngle, minuteAngle } = useMemo(() => {
    const h12 = (hours % 12) + minutes / 60 + seconds / 3600;
    const m = minutes + seconds / 60;
    const toRad = (deg) => (Math.PI / 180) * deg;
    return {
      hourAngle: toRad(h12 * 30 - 90), 
      minuteAngle: toRad(m * 6 - 90),  
    };
  }, [hours, minutes, seconds]);

  const hourLen = r * 0.50;
  const minuteLen = r * 0.78;

  //ángulo + longitud => punto x,y
  const pointOnCircle = (angle, len) => ({
    x: center.x + Math.cos(angle) * len,
    y: center.y + Math.sin(angle) * len,
  });

  const hourEnd = pointOnCircle(hourAngle, hourLen);
  const minuteEnd = pointOnCircle(minuteAngle, minuteLen);

  // Marcas (ticks)
  const ticks = useMemo(() => {
    const items = [];
    for (let i = 0; i < 60; i++) {
      const isHourTick = i % 5 === 0;
      const angle = (Math.PI / 30) * i - Math.PI / 2;
      const inner = r - (isHourTick ? 18 : 10);
      const outer = r - 4;
      const x1 = center.x + Math.cos(angle) * inner;
      const y1 = center.y + Math.sin(angle) * inner;
      const x2 = center.x + Math.cos(angle) * outer;
      const y2 = center.y + Math.sin(angle) * outer;
      items.push({ x1, y1, x2, y2, isHourTick });
    }
    return items;
  }, [r]);

  // Números
  const numbers = useMemo(() => {
    if (!showNumbers) return [];
    const arr = [];
    for (let i = 1; i <= 12; i++) {
      const angle = (Math.PI / 6) * i - Math.PI / 2;
      const rr = r * 0.78;
      const x = center.x + Math.cos(angle) * rr;
      const y = center.y + Math.sin(angle) * rr + 4;
      arr.push({ i, x, y });
    }
    return arr;
  }, [showNumbers, r]);

  return (
    <View style={[styles.container, { width: size, height: size }, style]}>
      <Svg width={size} height={size}>
        {/* Fondo */}
        <Circle cx={center.x} cy={center.y} r={r - 4} fill={theme.bg} />
        {/* Aro */}
        <Circle cx={center.x} cy={center.y} r={r - 4} stroke={theme.ring} strokeWidth={6} fill="none" />

        {/* Ticks */}
        <G>
          {ticks.map((t, idx) => (
            <Line
              key={idx}
              x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2}
              stroke={theme.ticks}
              strokeWidth={t.isHourTick ? 2.4 : 1.2}
              strokeLinecap="round"
            />
          ))}
        </G>

        {/* Números */}
        {numbers.map(n => (
          <SvgText
            key={n.i}
            x={n.x}
            y={n.y}
            fontSize="14"
            textAnchor="middle"
            fill={theme.ticks}
          >
            {n.i}
          </SvgText>
        ))}

        {/* Aguja hora */}
        <Line
          x1={center.x} y1={center.y}
          x2={hourEnd.x} y2={hourEnd.y}
          stroke={theme.hands}
          strokeWidth={4}
          strokeLinecap="round"
        />

        {/* Aguja minuto */}
        <Line
          x1={center.x} y1={center.y}
          x2={minuteEnd.x} y2={minuteEnd.y}
          stroke={theme.hands}
          strokeWidth={3}
          strokeLinecap="round"
        />

        {/* Centro */}
        <Circle cx={center.x} cy={center.y} r={5} fill={theme.hub} />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
  },
});

export default SmartClock;